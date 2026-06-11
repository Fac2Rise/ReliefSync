# Use a base Java runtime image (AWS ECR public mirror to avoid rate limits)
FROM public.ecr.aws/docker/library/eclipse-temurin:21-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the built JAR file from your target folder
COPY target/*.jar app.jar

# Expose the port your application runs on (change as needed)
EXPOSE 8083

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]