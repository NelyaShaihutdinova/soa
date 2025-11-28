package ru.ifmo.api;

import jakarta.ejb.EJB;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.ifmo.external.model.Error;
import ru.ifmo.model.MaintenanceReport;
import ru.ifmo.service.DictionaryProcessingRemote;

@Path("/reports")
@Produces(MediaType.APPLICATION_JSON)
public class ReportsResource {

    @EJB
    private DictionaryProcessingRemote dictionaryProcessingRemote;

    @GET
    @Path("/maintenance/{vehicle-id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMaintenanceReport(
            @PathParam("vehicle-id") @Min(1) Integer vehicleId,
            @QueryParam("format") @DefaultValue("json") String format,
            @QueryParam("include-details") @DefaultValue("true") Boolean includeDetails,
            @QueryParam("include-costs") @DefaultValue("true") Boolean includeCosts) {
        try {
            return Response.ok(getReport(vehicleId, format, includeDetails, includeCosts))
                    .build();
        } catch (RuntimeException e) {
            return errorResponse(404, "Vehicle wasn't found");
        }
    }

    private MaintenanceReport getReport(Integer vehicleId, String format, Boolean includeDetails, Boolean includeCosts) {
        return dictionaryProcessingRemote.generateMaintenanceReport(
                vehicleId,
                format,
                includeDetails,
                includeCosts
        );
    }

    private Response errorResponse(int code, String message) {
        var error = new Error();
        error.setTimestamp(java.time.OffsetDateTime.now());
        error.setStatus(code);
        error.setMessage(message);
        return Response.status(code).entity(error).build();
    }
}