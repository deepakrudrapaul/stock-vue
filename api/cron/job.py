def handler(request, response):
    # Your cron job logic here
    print("Hello from Vercel Cron Job!")

    return response.send("Cron job executed successfully!")
