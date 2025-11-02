FROM openjdk:17-oracle
LABEL maintainer="prpaulino@mymail.mapua.edu.ph"
WORKDIR /opt/app
EXPOSE 8080
# Use the JAR file that Maven produces for this project
COPY target/PetSupply-1.0-SNAPSHOT.jar /opt/app/petsupply.jar
ENTRYPOINT ["java", "-jar", "petsupply.jar"]
