package ru.ifmo.first_wildfly;

import jakarta.servlet.Filter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import ru.ifmo.first_wildfly.config.SimpleCorsFilter;

@SpringBootApplication
public class FirstWildflyApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(FirstWildflyApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(FirstWildflyApplication.class);
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
