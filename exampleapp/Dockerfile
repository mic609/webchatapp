# Użyj obrazu JDK 21 jako bazowego
FROM openjdk:21-jdk-slim AS build

# Zainstaluj wymagane zależności
RUN apt-get update && apt-get install -y wget unzip

# Pobierz i zainstaluj Maven 3.9.9
RUN wget https://downloads.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz -O /tmp/apache-maven-3.9.9-bin.tar.gz \
    && tar -xzf /tmp/apache-maven-3.9.9-bin.tar.gz -C /opt \
    && rm /tmp/apache-maven-3.9.9-bin.tar.gz

# Dodaj Maven do zmiennych środowiskowych
ENV MAVEN_HOME=/opt/apache-maven-3.9.9
ENV PATH=${MAVEN_HOME}/bin:${PATH}

# Ustaw katalog roboczy
WORKDIR /exampleapp

# Skopiuj plik pom.xml (dla Maven)
COPY pom.xml .

# Skopiuj plik zależności (np. .m2 lub .gradle)
COPY src ./src

# Zbuduj aplikację Spring Boot
RUN mvn clean package -DskipTests

# Użyj obrazu JDK 21 do uruchomienia aplikacji
FROM openjdk:21-jdk-slim

# Skopiuj zbudowaną aplikację do obrazu
COPY --from=build /exampleapp/target/exampleapp-0.0.1-SNAPSHOT.jar /exampleapp-0.0.1-SNAPSHOT.jar

# Otwórz port, na którym aplikacja będzie działać
EXPOSE 8080

# Uruchom aplikację Spring Boot
CMD ["java", "-jar", "/exampleapp-0.0.1-SNAPSHOT.jar"]
