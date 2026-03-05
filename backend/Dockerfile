
#FROM eclipse-temurin:21-jdk
#WORKDIR /app
#COPY target/*.jar app.jar
#ENTRYPOINT ["java","-jar","/app/app.jar"]

# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]

#HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
# CMD curl -f http://localhost:8080/actuator/health || exit 1