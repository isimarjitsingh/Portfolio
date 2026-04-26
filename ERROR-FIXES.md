# Student Fees Management System - Error Fixes & Troubleshooting Guide

## 🔧 Common Errors and Solutions

### 1. Database Connection Issues

#### Error: `ORA-12541: TNS:no listener`
**Cause**: Oracle listener is not running
**Solution**:
```bash
# Start Oracle listener
lsnrctl start

# Check listener status
lsnrctl status
```

#### Error: `ORA-12154: TNS:could not resolve the connect identifier`
**Cause**: Incorrect connection string format
**Solution**:
```env
# Correct format in .env
ORACLE_CONNECTION_STRING=localhost:1521/XE
# or
ORACLE_CONNECTION_STRING=hostname:port/service_name
```

#### Error: `ORA-01017: invalid username/password`
**Cause**: Wrong credentials
**Solution**: Verify username and password in `.env` file

#### Error: `DPI-1047: Cannot locate Oracle Client library`
**Cause**: Oracle Instant Client not installed or not in PATH
**Solution**:
```bash
# Install Oracle Instant Client
# Set ORACLE_CLIENT_LIB_DIR in .env
ORACLE_CLIENT_LIB_DIR=C:/oracle/instantclient_21_7
```

### 2. Server Startup Issues

#### Error: `EADDRINUSE: address already in use`
**Cause**: Port 3000 is already in use
**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
PORT=3001 node fees-server-fixed.js
```

#### Error: `Cannot find module 'oracledb'`
**Cause**: Dependencies not installed
**Solution**:
```bash
npm install
```

### 3. Frontend JavaScript Errors

#### Error: `Cannot read property of null`
**Cause**: DOM elements not found
**Solution**: Fixed in `fees-app-fixed.js` with proper null checks

#### Error: `fetch failed`
**Cause**: Server not running or CORS issues
**Solution**: 
1. Ensure server is running: `node fees-server-fixed.js`
2. Check server logs for errors

### 4. Database Schema Issues

#### Error: `ORA-00942: table or view does not exist`
**Cause**: Tables not created
**Solution**:
```sql
-- Run setup script
sqlplus your_username/your_password@your_connection_string
SQL> @database/fees-setup.sql
```

#### Error: `ORA-00001: unique constraint violated`
**Cause**: Duplicate data insertion
**Solution**: Fixed in backend with proper error handling

## 🚀 Fixed Files List

### Backend Fixes
- **`fees-server-fixed.js`**: 
  - Added proper error handling
  - Fixed Oracle connection pooling
  - Added input validation
  - Improved response handling
  - Added health check endpoint

### Frontend Fixes
- **`fees-app-fixed.js`**:
  - Added null checks for DOM elements
  - Improved error handling
  - Fixed async/await issues
  - Added proper event listener setup
  - Fixed currency formatting

### CSS Fixes
- **`fees-style-fixed.css`**:
  - Fixed responsive design issues
  - Added missing animations
  - Improved mobile layout
  - Fixed button hover effects
  - Added proper transitions

### Database Fixes
- **`fees-schema.sql`**: Original schema (no issues found)
- **`fees-setup.sql`**: Setup script (no issues found)

## 🛠️ Testing Tools

### Database Connection Test
```bash
node test-fees-connection.js
```

### API Endpoints Test
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test dashboard stats
curl http://localhost:3000/api/dashboard/stats
```

## 📋 Quick Setup Checklist

### 1. Environment Setup
- [ ] Node.js installed (v14+)
- [ ] Oracle Database running
- [ ] Oracle Instant Client installed
- [ ] `.env` file configured

### 2. Database Setup
- [ ] Run `sqlplus` and connect to database
- [ ] Execute `@database/fees-setup.sql`
- [ ] Verify tables created with test script

### 3. Application Setup
- [ ] Install dependencies: `npm install`
- [ ] Start server: `node fees-server-fixed.js`
- [ ] Test connection: `node test-fees-connection.js`
- [ ] Open browser: `http://localhost:3000/fees-index.html`

## 🔍 Debug Mode

### Enable Debug Logging
```bash
# Set debug environment
set DEBUG=*
node fees-server-fixed.js
```

### Browser Console Debugging
1. Open browser developer tools
2. Check console for JavaScript errors
3. Network tab for API requests
4. Application tab for local storage

## 📱 Mobile Issues Fixed

### Responsive Design
- Fixed sidebar navigation on mobile
- Improved table scrolling
- Fixed button sizes on small screens
- Added proper touch targets

### Performance
- Optimized CSS animations
- Reduced JavaScript execution time
- Added loading states
- Implemented proper error boundaries

## 🎯 Production Considerations

### Security
- Add password hashing (bcrypt)
- Implement JWT authentication
- Add rate limiting
- Use HTTPS in production

### Performance
- Enable database connection pooling
- Add API response caching
- Optimize database queries
- Use CDN for static assets

### Monitoring
- Add application logging
- Implement error tracking
- Set up health checks
- Monitor database performance

## 🆘 Emergency Fixes

### Server Crashes
1. Check Oracle connection
2. Verify environment variables
3. Check database logs
4. Restart server with fixed version

### Frontend Not Loading
1. Check browser console for errors
2. Verify server is running
3. Check network requests
4. Clear browser cache

### Database Issues
1. Verify Oracle listener is running
2. Check table permissions
3. Test connection with SQL Plus
4. Re-run setup script if needed

## 📞 Support

If you encounter issues not covered here:

1. **Check the console** - Both browser and server consoles
2. **Run the test script** - `node test-fees-connection.js`
3. **Verify configuration** - Check `.env` file settings
4. **Review logs** - Server and Oracle logs
5. **Test components** - Test backend, frontend, and database separately

## 🔄 Regular Maintenance

### Daily
- Check server logs
- Monitor database connections
- Verify backup status

### Weekly
- Update dependencies
- Check for security updates
- Monitor performance metrics

### Monthly
- Database maintenance
- Log cleanup
- Performance optimization

---

**Note**: All fixes have been tested and validated. Use the `-fixed` versions of files for the most stable experience.
