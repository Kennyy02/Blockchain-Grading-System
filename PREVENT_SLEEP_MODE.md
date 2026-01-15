# Preventing Sleep Mode on Render and Aiven

This guide explains how to prevent your application and database from going to sleep on Render (free tier) and Aiven (free tier).

## Problem

- **Render Free Tier**: Automatically sleeps after 15 minutes of inactivity
- **Aiven Free Tier**: Automatically pauses the database after inactivity

## Solutions Implemented

### 1. Keep-Alive Endpoints

Two endpoints have been created to keep your services active:

- **`/ping`** - Simple keep-alive endpoint that also pings the database
- **`/health`** - Health check endpoint with detailed status

These endpoints can be accessed at:
- `https://your-app.onrender.com/ping`
- `https://your-app.onrender.com/health`

### 2. Scheduled Task (Database Keep-Alive)

A Laravel scheduled task runs every 5 minutes to keep the Aiven database active by performing a simple query (`SELECT 1`). This prevents the database from auto-pausing.

The scheduler is configured in `routes/console.php` and runs automatically via the worker service in `render.yaml`.

### 3. External Ping Service (Recommended for Render)

To prevent Render from sleeping, set up an external service to ping your app every 10-14 minutes:

#### Option A: UptimeRobot (Free)

1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Create a free account
3. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Your App Keep-Alive
   - **URL**: `https://your-app.onrender.com/ping`
   - **Monitoring Interval**: 5 minutes (free tier allows 5-minute intervals)
4. Save the monitor

#### Option B: Cron-Job.org (Free)

1. Go to [cron-job.org](https://cron-job.org)
2. Create a free account
3. Create a new cron job:
   - **Title**: Render Keep-Alive
   - **URL**: `https://your-app.onrender.com/ping`
   - **Schedule**: Every 10 minutes (`*/10 * * * *`)
4. Save the cron job

#### Option C: EasyCron (Free Tier Available)

1. Go to [EasyCron.com](https://www.easycron.com)
2. Create an account
3. Add a new cron job:
   - **URL**: `https://your-app.onrender.com/ping`
   - **Schedule**: Every 10 minutes
4. Save the cron job

## Render Configuration

### Current Setup

The `render.yaml` file has been configured with:

1. **Health Check Path**: Set to `/ping` to use the keep-alive endpoint
2. **Worker Service**: Added a scheduler worker that runs `php artisan schedule:work` to execute scheduled tasks

### Upgrading to Paid Plan (Alternative)

If you want to completely eliminate sleep mode, you can upgrade to a paid plan:

1. Go to your Render dashboard
2. Select your service
3. Click "Settings"
4. Change the plan from "Free" to "Starter" ($7/month) or higher
5. Paid plans never sleep

## Aiven Configuration

### Current Setup

The scheduled task in `routes/console.php` automatically keeps your Aiven database active by pinging it every 5 minutes.

### Aiven Auto-Pause Behavior

Aiven's free tier databases auto-pause after a period of inactivity. The scheduled task prevents this by:

- Running every 5 minutes
- Performing a simple `SELECT 1` query
- Logging success/failure for monitoring

### Upgrading Aiven (Alternative)

If you need guaranteed uptime:

1. Go to your Aiven dashboard
2. Select your database service
3. Upgrade to a paid plan
4. Paid plans don't auto-pause

## Testing

### Test Keep-Alive Endpoints

```bash
# Test ping endpoint
curl https://your-app.onrender.com/ping

# Test health endpoint
curl https://your-app.onrender.com/health
```

Expected response from `/ping`:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z",
  "database": "connected"
}
```

### Verify Scheduler is Running

Check your Render logs to see if the scheduler is executing:

1. Go to Render dashboard
2. Select the "scheduler" worker service
3. View logs
4. You should see entries like: "Database keep-alive ping successful"

## Troubleshooting

### Render Still Sleeping

1. **Check External Ping Service**: Ensure your external ping service (UptimeRobot, etc.) is active and pinging every 10-14 minutes
2. **Verify Endpoint**: Test `/ping` endpoint manually to ensure it's working
3. **Check Logs**: Review Render logs for any errors
4. **Upgrade Plan**: Consider upgrading to a paid plan if free tier limitations are too restrictive

### Database Still Pausing

1. **Check Scheduler**: Verify the scheduler worker is running in Render
2. **Check Logs**: Review logs for "Database keep-alive ping" messages
3. **Manual Test**: Run `php artisan schedule:list` to see scheduled tasks
4. **Database Connection**: Verify database credentials are correct

### Scheduler Not Running

If the scheduler worker isn't running:

1. Check `render.yaml` - ensure the worker service is configured
2. Verify the worker service is deployed in Render dashboard
3. Check worker logs for errors
4. Ensure `php artisan schedule:work` command is available

## Additional Notes

- The keep-alive endpoints are public and don't require authentication (they're lightweight)
- The scheduled task uses `withoutOverlapping()` to prevent multiple instances
- Database pings are logged for monitoring purposes
- All keep-alive mechanisms are lightweight and won't impact performance

## Cost Considerations

**Free Tier Limitations:**
- Render: Sleeps after 15 minutes of inactivity
- Aiven: Auto-pauses after inactivity

**Solutions:**
- External ping service: Free (UptimeRobot, cron-job.org)
- Scheduled task: Free (runs on Render worker)
- Upgrade: $7+/month for Render, varies for Aiven

The implemented solution uses free services to keep everything active!

