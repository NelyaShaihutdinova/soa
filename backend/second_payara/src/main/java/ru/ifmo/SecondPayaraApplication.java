package ru.ifmo;

import jakarta.servlet.Filter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import ru.ifmo.config.SimpleCorsFilter;

@SpringBootApplication
public class SecondPayaraApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(SecondPayaraApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SecondPayaraApplication.class);
    }

    @Bean
    public FilterRegistrationBean<Filter> corsFilter() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new SimpleCorsFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setName("CORS Filter");
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }
}