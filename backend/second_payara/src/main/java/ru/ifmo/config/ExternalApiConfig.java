package ru.ifmo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;
import ru.ifmo.external.api.StatisticsApi;
import ru.ifmo.external.api.VehiclesApi;
import ru.ifmo.external.invoker.ApiClient;

@Configuration
public class ExternalApiConfig {

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
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());

        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory();
        uriBuilderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.VALUES_ONLY);
        restTemplate.setUriTemplateHandler(uriBuilderFactory);
        return restTemplate;
    }
}
