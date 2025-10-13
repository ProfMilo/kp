# 🚀 Careers Subdomain Setup Guide

## Overview
This guide will help you set up `careers.yourcompany.com` as a dedicated subdomain for your recruitment system, providing candidates with easy access to job opportunities and applications.

## 🌐 **Step 1: DNS Configuration**

### **Option A: Using Your Domain Registrar**
1. **Log into your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Navigate to DNS Management**
3. **Add a new A record:**
   ```
   Type: A
   Name: careers
   Value: [Your Server IP Address]
   TTL: 3600 (or default)
   ```

### **Option B: Using Cloudflare**
1. **Log into Cloudflare dashboard**
2. **Select your domain**
3. **Go to DNS settings**
4. **Add A record:**
   ```
   Type: A
   Name: careers
   Content: [Your Server IP Address]
   Proxy status: DNS only (gray cloud)
   ```

### **Option C: Using AWS Route 53**
1. **Log into AWS Console**
2. **Navigate to Route 53**
3. **Select your hosted zone**
4. **Create A record:**
   ```
   Record type: A
   Record name: careers
   Value: [Your Server IP Address]
   TTL: 300
   ```

## 🖥️ **Step 2: Server Configuration**

### **Nginx Configuration**
Create or update your Nginx configuration file:

```nginx
server {
    listen 80;
    server_name careers.yourcompany.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name careers.yourcompany.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Root directory
    root /var/www/careers;
    index index.html;
    
    # Handle Next.js routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location /_next/static/ {
        alias /var/www/careers/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **Apache Configuration**
If using Apache, update your virtual host:

```apache
<VirtualHost *:80>
    ServerName careers.yourcompany.com
    Redirect permanent / https://careers.yourcompany.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName careers.yourcompany.com
    DocumentRoot /var/www/careers
    
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    
    <Directory /var/www/careers>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Handle Next.js routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]
</VirtualHost>
```

## 🔒 **Step 3: SSL Certificate Setup**

### **Option A: Let's Encrypt (Free)**
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d careers.yourcompany.com

# Auto-renewal
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### **Option B: Commercial SSL Certificate**
1. **Purchase SSL certificate** from your provider
2. **Download certificate files**
3. **Upload to your server**
4. **Update Nginx/Apache configuration**

## 🚀 **Step 4: Deployment**

### **Build and Deploy**
```bash
# Navigate to your project directory
cd /path/to/your/project

# Install dependencies
npm install

# Build the application
npm run build

# Copy to web directory
sudo cp -r .next /var/www/careers/
sudo cp -r public /var/www/careers/
sudo cp package.json /var/www/careers/

# Set permissions
sudo chown -R www-data:www-data /var/www/careers
sudo chmod -R 755 /var/www/careers

# Restart web server
sudo systemctl restart nginx
# or
sudo systemctl restart apache2
```

### **PM2 Process Manager (Recommended)**
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start npm --name "careers" -- start

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor the application
pm2 monit
```

## 📱 **Step 5: Testing**

### **Test Your Setup**
1. **DNS Propagation Check:**
   ```bash
   nslookup careers.yourcompany.com
   dig careers.yourcompany.com
   ```

2. **SSL Check:**
   - Visit `https://careers.yourcompany.com`
   - Check SSL certificate validity
   - Test on mobile devices

3. **Functionality Test:**
   - Browse job listings
   - Test application form
   - Verify mobile responsiveness

## 🔗 **Step 6: Integration with Main Website**

### **Add to Main Website Navigation**
```html
<!-- Add this to your main website -->
<nav>
    <a href="https://careers.yourcompany.com">Careers</a>
</nav>
```

### **Email Signatures**
```
Best regards,
[Your Name]
[Your Title]
[Company Name]

Join our team: https://careers.yourcompany.com
```

### **Social Media**
- **LinkedIn:** Update company page with careers link
- **Instagram:** Add careers URL to bio
- **Facebook:** Create careers tab

## 📊 **Step 7: Analytics and Tracking**

### **Google Analytics Setup**
```html
<!-- Add to careers page -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### **UTM Parameters for Campaigns**
```
https://careers.yourcompany.com?utm_source=linkedin&utm_medium=social&utm_campaign=2024-hiring
https://careers.yourcompany.com?utm_source=email&utm_medium=newsletter&utm_campaign=job-alert
```

## 🎯 **Step 8: Marketing and Promotion**

### **Job Posting Platforms**
- **Indeed:** Include careers URL in all postings
- **LinkedIn Jobs:** Link to your careers page
- **Glassdoor:** Update company profile with careers link
- **Local job boards:** Include careers URL

### **Content Marketing**
- **Blog posts** about company culture
- **Employee testimonials** on careers page
- **Behind-the-scenes** content
- **Company values** and mission

## 🔧 **Step 9: Maintenance**

### **Regular Updates**
- **Weekly:** Check for broken links
- **Monthly:** Update job listings
- **Quarterly:** Review analytics and performance
- **Annually:** Update company information and branding

### **Monitoring**
```bash
# Check server status
sudo systemctl status nginx
sudo systemctl status apache2

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/apache2/error.log

# Monitor disk space
df -h
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **DNS Not Resolving:**
   - Wait for DNS propagation (up to 48 hours)
   - Check DNS record configuration
   - Verify server IP address

2. **SSL Certificate Issues:**
   - Check certificate expiration
   - Verify certificate path in configuration
   - Test with SSL checker tools

3. **Page Not Loading:**
   - Check web server status
   - Verify file permissions
   - Check firewall settings

4. **Application Errors:**
   - Check application logs
   - Verify environment variables
   - Test database connections

### **Useful Commands**
```bash
# Test DNS resolution
nslookup careers.yourcompany.com

# Test SSL connection
openssl s_client -connect careers.yourcompany.com:443

# Check web server status
sudo systemctl status nginx
sudo systemctl status apache2

# View real-time logs
sudo tail -f /var/log/nginx/access.log
```

## 📈 **Performance Optimization**

### **Caching Strategy**
```nginx
# Add to Nginx configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html|xml|txt)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### **CDN Integration**
- **Cloudflare:** Enable CDN for global performance
- **AWS CloudFront:** For AWS-hosted applications
- **Google Cloud CDN:** For GCP-hosted applications

## 🎉 **Success Metrics**

### **Track These KPIs**
- **Page load time** (target: <3 seconds)
- **Application completion rate** (target: >70%)
- **Mobile vs desktop usage**
- **Traffic sources** (direct, social, job boards)
- **Conversion rate** (visitors to applicants)

## 📞 **Support and Contact**

### **Need Help?**
- **Technical issues:** Check server logs and error messages
- **DNS problems:** Contact your domain registrar
- **SSL issues:** Verify certificate configuration
- **Performance:** Monitor server resources and optimize

### **Useful Resources**
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Apache Configuration Guide](https://httpd.apache.org/docs/)
- [DNS Management Best Practices](https://www.icann.org/resources/pages/dns-management-2012-02-25-en)

---

**🎯 Your careers subdomain is now ready to attract top talent!**

Remember to:
- ✅ Test thoroughly before going live
- ✅ Monitor performance and analytics
- ✅ Keep content updated and fresh
- ✅ Promote across all channels
- ✅ Maintain security and SSL certificates

Good luck with your recruitment efforts! 🚀
