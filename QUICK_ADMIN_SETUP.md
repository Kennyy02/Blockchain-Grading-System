# Quick Admin Setup Guide

## You've Set the Environment Variables - Now What?

If you've just set `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` in Railway Variables, you need to run the setup command to create/update the admin account.

## Quick Steps:

### Step 1: Open Railway Shell

1. Go to https://railway.app/
2. Open your **"System"** service (the web service, not MySQL)
3. Click on **"Deployments"** tab
4. Click on the **latest deployment**
5. Look for a **"Shell"** or **"Terminal"** button/tab
6. Click it to open a shell directly on Railway's server

### Step 2: Run the Command

In the Railway shell, type:

```bash
php artisan admin:setup-from-env
```

You should see output like:

```
✓ Admin account created successfully!
  Name: Administrator
  Email: admin@smms.edu.ph
  Password: [Set from environment]
  Role: admin

You can now log in with:
  Email: admin@smms.edu.ph
  Password: [The password you set in ADMIN_PASSWORD]
```

### Step 3: Log In

Go to your login page and use:
- **Email:** `admin@smms.edu.ph` (or whatever you set in `ADMIN_EMAIL`)
- **Password:** `admin123` (or whatever you set in `ADMIN_PASSWORD`)

## Alternative: Wait for Next Deployment

If you don't want to run it manually, the command will run automatically on the next deployment. To trigger a redeploy:

1. Go to Railway → Your service → Deployments
2. Click **"Redeploy"** button
3. Wait for deployment to complete
4. The admin account will be created automatically

## Troubleshooting

### If the command says "ADMIN_EMAIL not set"
- Make sure you added the variables to the **System** service (web service), not the MySQL service
- Check that the variable names are exactly: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

### If you still can't log in
- Make sure the password is at least 8 characters
- Check the deployment logs to see if the command ran successfully
- Try running the command again manually via Railway shell

