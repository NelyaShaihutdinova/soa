FROM eclipse-temurin:17-jre

COPY target/first_wildfly-0.0.1-SNAPSHOT.war /opt/app/app.war
COPY src/main/resources/keystore/baeldung.p12 /opt/keystore/baeldung.p12

WORKDIR /opt/payara

EXPOSE ${APP_PORT}

CMD java \
     -DPORT=${APP_PORT} \
     -Djavax.net.ssl.keyStore=/opt/keystore/baeldung.p12 \
     -Djavax.net.ssl.keyStorePassword=changeit \
     -Djavax.net.ssl.trustStore=/opt/keystore/baeldung.p12 \
     -Djavax.net.ssl.trustStorePassword=changeit \
     -Dpayara.micro.sslKeyAlias=s1as \
     -jar payara-micro.jar \
     --sslport ${APP_PORT} \
     --deploy /opt/app/app.war