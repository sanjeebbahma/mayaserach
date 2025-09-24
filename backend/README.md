# MAYA Search Engine - Backend (SearXNG Docker)

This directory contains the Docker-based SearXNG backend for the MAYA Search Engine.

## Quick Start

### Windows (PowerShell)

```powershell
.\run-searxng.ps1
```

### Linux/macOS (Bash)

```bash
chmod +x run-searxng.sh
./run-searxng.sh
```

## Manual Setup

1. **Start the services:**

   ```bash
   docker compose up -d
   ```

2. **Access the search engine:**

   - Web Interface: http://localhost
   - JSON API: http://localhost/search?q=test&format=json

3. **View logs:**

   ```bash
   docker compose logs -f
   ```

4. **Stop the services:**
   ```bash
   docker compose down
   ```

## Configuration

### Environment Variables (.env)

- `SEARXNG_HOSTNAME`: The hostname for your SearXNG instance (default: localhost)

### SearXNG Settings (searxng/settings.yml)

- Search engines configuration
- UI preferences
- Security settings
- Performance tuning

### Caddy Configuration (Caddyfile)

- Reverse proxy setup
- SSL/TLS termination
- Security headers
- Static file caching

## API Usage

### Search Request

```bash
curl "http://localhost/search?q=your+search+query&format=json"
```

### Response Format

```json
{
  "query": "your search query",
  "number_of_results": 10,
  "results": [
    {
      "title": "Result Title",
      "url": "https://example.com",
      "content": "Result description...",
      "engines": ["google", "bing"]
    }
  ],
  "suggestions": ["suggestion1", "suggestion2"]
}
```

## Troubleshooting

### Common Issues

1. **Port 80/443 already in use:**

   - Change ports in docker-compose.yaml
   - Or stop other services using these ports

2. **Permission denied:**

   - Make sure Docker is running
   - Check file permissions on scripts

3. **Services not starting:**
   - Check logs: `docker compose logs`
   - Verify Docker is running
   - Check available disk space

### Useful Commands

```bash
# View all containers
docker ps -a

# View logs for specific service
docker compose logs searxng

# Restart services
docker compose restart

# Update images
docker compose pull
docker compose up -d

# Remove all data (reset)
docker compose down -v
```

## Development

For development with the Next.js frontend:

1. Start SearXNG backend:

   ```bash
   docker compose up -d
   ```

2. Update frontend environment variables:

   ```env
   NEXT_PUBLIC_SEARXNG_URL=http://localhost
   ```

3. Start Next.js development server:
   ```bash
   npm run dev
   ```

## Production Deployment

For production deployment:

1. Update `.env` with your domain:

   ```env
   SEARXNG_HOSTNAME=your-domain.com
   ```

2. Update `searxng/settings.yml` with production settings

3. Deploy with:
   ```bash
   docker compose up -d
   ```

## Security Notes

- Change the secret key in `searxng/settings.yml`
- Configure proper firewall rules
- Use HTTPS in production
- Regularly update Docker images
