# Detect Brand with OpenAI and NestJS

This project is a NestJS application that detects brands in images and videos using the OpenAI API.

## Description

This application allows users to upload images and videos, which are then analyzed to detect brands. The application uses the OpenAI API for brand detection and MinIO for file storage.

## Project Setup

### Install Dependencies

```bash
yarn install
brew install ffmpeg // For MacOS
sudo apt-get install ffmpeg // For Linux
```

## Configuration

Create a env.yaml file in folder config with the following content

```yaml
app:
  port: 3080

minio:
  endPoint: 'your-minio-endpoint'
  port: 9000
  useSSL: false
  accessKey: your-access-key
  secretKey: your-secret-key

openai:
  apiKey: your-openai-api-key
```

## Endpoint

Detect Brands in Image

URL: /detects/image

- Method: POST
- Description: Detect brands in an uploaded image.
- Request Body: JSON object with the image file path.
- Response: JSON object with detected brands.

### Detect Brands in Video

URL: /detects/video

- Method: POST
- Description: Detect brands in an uploaded video.
- Request Body: JSON object with the video file path.
- Response: JSON object with detected brands.
