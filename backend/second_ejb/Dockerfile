FROM payara/server-full:6.2025.11-jdk17

COPY ./app-ear/target/app-ear-1.0-SNAPSHOT.ear /opt/payara/deployments/
COPY ./ejb_web/src/main/resources/keystore/baeldung.p12 /opt/payara/appserver/domains/domain1/config/keystore.p12
COPY preboot-commands.asadmin /opt/payara/

ENV PREBOOT_COMMANDS=/opt/payara/preboot-commands.asadmin

EXPOSE ${APP_PORT} 4848

CMD ["/opt/payara/appserver/bin/asadmin", "start-domain", "--verbose"]