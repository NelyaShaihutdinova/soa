package ru.ifmo.config;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;
import ru.ifmo.external.api.StatisticsApi;
import ru.ifmo.external.api.VehiclesApi;
import ru.ifmo.external.invoker.ApiClient;

import javax.net.ssl.SSLContext;


@Configuration
public class ExternalApiConfig {

    @Value("${trust.store}")
    private Resource trustStore;

    @Value("${trust.store.password}")
    private String trustStorePassword;

    @Bean
    public StatisticsApi statisticsApi(ApiClient apiClient) {
        return new StatisticsApi(apiClient);
    }

    @Bean
    public VehiclesApi vehiclesApi(ApiClient apiClient) {
        return new VehiclesApi(apiClient);
    }

    @Bean
    public ApiClient apiClient(RestTemplate restTemplate) {
        return new ApiClient(restTemplate);
    }

    @Bean
    public RestTemplate restTemplate() throws Exception {
//        var sslContext = new SSLContextBuilder()
//                .loadTrustMaterial(trustStore.getURL(), trustStorePassword.toCharArray())
//                .build();
//
//        var sslConFactory = new SSLConnectionSocketFactory(sslContext);
//
//        var cm = PoolingHttpClientConnectionManagerBuilder.create()
//                .setSSLSocketFactory(sslConFactory)
//                .build();
//
//        var httpClient = HttpClients.custom()
//                .setConnectionManager(cm)
//                .build();
//
//        var requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
//
//        RestTemplate restTemplate = new RestTemplate(requestFactory);
//
//        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory();
//        uriBuilderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.VALUES_ONLY);
//        restTemplate.setUriTemplateHandler(uriBuilderFactory);
//
//        return restTemplate;
        SSLContext sslContext = new SSLContextBuilder()
                .loadTrustMaterial(null, (chain, authType) -> true) // Принимаем все сертификаты
                .build();

        SSLConnectionSocketFactory sslSocketFactory = new SSLConnectionSocketFactory(
                sslContext,
                NoopHostnameVerifier.INSTANCE // Отключаем проверку hostname
        );

        var cm = PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(sslSocketFactory)
                .build();

        var httpClient = HttpClients.custom()
                .setConnectionManager(cm)
                .build();

        var requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(30000);

        RestTemplate restTemplate = new RestTemplate(requestFactory);

        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory();
        uriBuilderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.VALUES_ONLY);
        restTemplate.setUriTemplateHandler(uriBuilderFactory);

        return restTemplate;
    }
}
