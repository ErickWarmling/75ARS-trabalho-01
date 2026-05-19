FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

RUN apk add --no-cache bash

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

COPY src src
RUN ./mvnw package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY --from=build /app/target/tutor-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
