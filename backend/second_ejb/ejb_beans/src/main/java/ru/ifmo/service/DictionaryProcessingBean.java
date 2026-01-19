package ru.ifmo.service;

import jakarta.ejb.Remote;
import jakarta.ejb.Stateless;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import ru.ifmo.external.model.Coordinates;
import ru.ifmo.external.model.Vehicle;
import ru.ifmo.external.model.VehicleUpdate;
import ru.ifmo.external.model.VehiclesGet200Response;
import ru.ifmo.model.MaintenanceRecord;
import ru.ifmo.model.MaintenanceReport;
import ru.ifmo.model.MaintenanceStatistics;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.Collections.emptyList;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Stream.concat;

@Stateless
@Remote(DictionaryProcessingRemote.class)
public class DictionaryProcessingBean implements DictionaryProcessingRemote {

    private static final String EXTERNAL_SERVICE_BASE_URL = "https://haproxy:8443/api";

    @Override
    public List<Vehicle> searchVehiclesByEnginePower(Integer from, Integer to) {
        var firstPage = getVehiclesPageByEnginePower(from, to, 1);
        var totalPages = firstPage.getTotalPages();
        if (nonNull(totalPages) && totalPages > 1) {
            return mergeVehiclePages(from, to, totalPages, firstPage);
        }
        return ofNullable(firstPage.getContent()).map(content ->
                        content.stream().collect(Collectors.toList())
                )
                .orElse(emptyList());
    }

    @Override
    public Vehicle addWheelsToVehicle(Integer vehicleId, Integer numberOfWheels) {
        var context = buildSSLContext();
        try (var client = ClientBuilder.newBuilder()
                .sslContext(context)
                .hostnameVerifier((hostname, session) -> true)
                .build()) {
            WebTarget target = client.target(EXTERNAL_SERVICE_BASE_URL)
                    .path("/vehicles/" + vehicleId);

            var vehicleUpdate = new VehicleUpdate().numberOfWheels(numberOfWheels);
            return target.request().post(Entity.entity(vehicleUpdate, MediaType.APPLICATION_JSON_TYPE), Vehicle.class);
        }
    }

    @Override
    public List<Vehicle> searchVehiclesByCoordinates(Long x, Integer y, Integer maxDistance) {
        var firstPage = getVehiclesPage(1);
        var totalPages = firstPage.getTotalPages();
        return getAllVehicles(totalPages, firstPage)
                .stream()
                .filter(vehicle -> filterByCoordinates(vehicle.getCoordinates(), x, y, Long.valueOf(maxDistance)))
                .collect(toList());
    }

    @Override
    public MaintenanceReport generateMaintenanceReport(Integer vehicleId, String format, Boolean includeDetails, Boolean includeCosts) {
        Vehicle vehicle = getVehicleFromRemoteService(vehicleId);
        MaintenanceReport report = new MaintenanceReport();

        report.setVehicleId(vehicleId);
        report.setVehicleInfo(vehicle);
        report.setGeneratedAt(LocalDateTime.now());

        MaintenanceReport.ReportPeriod reportPeriod = new MaintenanceReport.ReportPeriod();
        reportPeriod.setStartDate(isNull(vehicle.getCreationDate()) ? null : vehicle.getCreationDate().toLocalDateTime());
        reportPeriod.setEndDate(LocalDateTime.now());
        report.setReportPeriod(reportPeriod);

        report.setTotalMaintenanceCount(5);

        if (Boolean.TRUE.equals(includeCosts)) {
            report.setTotalCost(15000.0);
        }

        if (Boolean.TRUE.equals(includeDetails)) {
            List<MaintenanceRecord> records = createMaintenanceRecords();
            report.setMaintenanceRecords(records);
        }

        MaintenanceStatistics statistics = new MaintenanceStatistics();
        statistics.setAverageCostPerMaintenance(3000.0);
        statistics.setTotalDowntimeHours(48.5);
        report.setStatistics(statistics);

        return report;
    }

    private List<Vehicle> getAllVehicles(Integer totalPages, VehiclesGet200Response firstPage) {
        if (nonNull(totalPages) && totalPages > 1) {
            return mergeVehiclePages(totalPages, firstPage);
        }
        return ofNullable(firstPage.getContent()).map(content ->
                        content.stream().collect(toList())
                )
                .orElse(emptyList());
    }

    private boolean filterByCoordinates(@NotNull @Valid Coordinates coordinates, Long x, Integer y, Long maxDistance) {
        long dx = coordinates.getX() - x;
        long dy = coordinates.getY().longValue() - y;
        long distanceSquared = dx * dx + dy * dy;
        long maxDistanceSquared = maxDistance * maxDistance;

        return distanceSquared <= maxDistanceSquared;
    }

    private List<Vehicle> mergeVehiclePages(Integer totalPages, VehiclesGet200Response firstPage) {
        var vehiclesStream = IntStream.range(2, totalPages - 1)
                .mapToObj(this::getVehiclesPage)
                .map(VehiclesGet200Response::getContent)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream);
        if (nonNull(firstPage.getContent())) {
            return concat(vehiclesStream, firstPage.getContent().stream())
                    .collect(toList());
        }
        return vehiclesStream.collect(toList());
    }

    private List<Vehicle> mergeVehiclePages(Integer from, Integer to, Integer totalPages, VehiclesGet200Response firstPage) {
        var vehiclesStream = IntStream.range(2, totalPages - 1)
                .mapToObj(i -> getVehiclesPageByEnginePower(from, to, i))
                .map(VehiclesGet200Response::getContent)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream);
        if (nonNull(firstPage.getContent())) {
            return concat(vehiclesStream, firstPage.getContent().stream())
                    .collect(Collectors.toList());
        }
        return vehiclesStream.collect(Collectors.toList());
    }

    private List<MaintenanceRecord> createMaintenanceRecords() {
        MaintenanceRecord record1 = new MaintenanceRecord();
        record1.setId(1);
        record1.setDate(LocalDateTime.now().minusMonths(3));
        record1.setMileage(10000);
        record1.setDescription("Регулярное техническое обслуживание");
        record1.setCost(5000.0);
        record1.setPartsReplaced(Arrays.asList("Масло двигателя", "Фильтр масляный", "Фильтр воздушный"));
        record1.setTechnician("Иванов А.С.");
        record1.setDurationHours(2.5F);

        MaintenanceRecord record2 = new MaintenanceRecord();
        record2.setId(2);
        record2.setDate(LocalDateTime.now().minusMonths(6));
        record2.setMileage(20000);
        record2.setDescription("Замена тормозных колодок");
        record2.setCost(8000.0);
        record2.setPartsReplaced(Arrays.asList("Тормозные колодки", "Тормозная жидкость"));
        record2.setTechnician("Петров В.И.");
        record2.setDurationHours(3.0F);

        MaintenanceRecord record3 = new MaintenanceRecord();
        record3.setId(3);
        record3.setDate(LocalDateTime.now().minusMonths(1));
        record3.setMileage(15000);
        record3.setDescription("Замена свечей зажигания");
        record3.setCost(2000.0);
        record3.setPartsReplaced(Arrays.asList("Свечи зажигания"));
        record3.setTechnician("Сидоров П.М.");
        record3.setDurationHours(1.5F);

        return Arrays.asList(record1, record2, record3);
    }

    private Vehicle getVehicleFromRemoteService(Integer vehicleId) {
        var sslContext = buildSSLContext();
        try (var client = ClientBuilder.newBuilder()
                .sslContext(sslContext)
                .hostnameVerifier((hostname, session) -> true)
                .build()) {
            WebTarget target = client.target(EXTERNAL_SERVICE_BASE_URL)
                    .path("/vehicles/" + vehicleId);

            return target.request()
                    .get(Vehicle.class);
        }
    }

    private VehiclesGet200Response getVehiclesPage(int page) {
        var sslContext = buildSSLContext();
        try (var client = ClientBuilder.newBuilder()
                .sslContext(sslContext)
                .hostnameVerifier((hostname, session) -> true)
                .build()) {
            WebTarget target = client.target(EXTERNAL_SERVICE_BASE_URL)
                    .path("/vehicles")
                    .queryParam("page", page)
                    .queryParam("size", 20);

            return target.request().get(new GenericType<>() {
            });
        }
    }

    private VehiclesGet200Response getVehiclesPageByEnginePower(Integer from, Integer to, int page) {
        var sslContext = buildSSLContext();
        try (var client = ClientBuilder.newBuilder()
                .sslContext(sslContext)
                .hostnameVerifier((hostname, session) -> true)
                .build()) {
            WebTarget target = client.target(EXTERNAL_SERVICE_BASE_URL)
                    .path("/vehicles")
                    .queryParam("page", page)
                    .queryParam("size", 20)
                    .queryParam("minEnginePower", from)
                    .queryParam("maxEnginePower", to);

            return target.request().get(new GenericType<>() {
            });
        }
    }

    private SSLContext buildSSLContext() {
        try {
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(
                    null,
                    new TrustManager[]{new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(X509Certificate[] chain, String authType) {
                        }

                        @Override
                        public void checkServerTrusted(X509Certificate[] chain, String authType) {
                        }

                        @Override
                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }
                    }},
                    new java.security.SecureRandom()
            );
            return sslContext;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create SSL context", e);
        }
    }
}