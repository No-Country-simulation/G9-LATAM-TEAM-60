# ============================
# Etapa 1: Build
# ============================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiamos primero el pom.xml para aprovechar la cache de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el resto del código y compilamos
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================
# Etapa 2: Runtime
# ============================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Usuario no-root por seguridad
RUN addgroup -S energiai && adduser -S energiai -G energiai

COPY --from=build /app/target/*.jar app.jar

RUN chown -R energiai:energiai /app
USER energiai

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]