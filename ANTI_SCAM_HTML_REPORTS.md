# 🚨 Anti-Scam HTML Reports

## Overview

When a scam message is detected and deleted, the bot now generates a **downloadable HTML report** that preserves all evidence including:

✅ **Embedded Images** - Scam images are converted to Base64 and embedded directly in the HTML  
✅ **Full Message Content** - Complete text content preserved  
✅ **User Information** - Username, ID, timestamp  
✅ **Detection Details** - Confidence score, reason, detection type  
✅ **No External Storage** - Everything is self-contained in one HTML file  

---

## 📸 What It Looks Like

The HTML report includes:

### 1. **Header Section**
- 🚨 Big red warning banner
- Report title and generation info

### 2. **Detection Results**
- Detection type (TEXT, IMAGE, BOTH, FAST)
- Confidence score with visual progress bar
- Detailed reason for detection

### 3. **User Information**
- Username and user tag
- User ID (for moderation actions)

### 4. **Server & Channel**
- Server name
- Channel name
- Exact timestamp

### 5. **Message Content**
- Full text content preserved
- Formatted for readability

### 6. **Attachments** ⭐
- **Images are embedded as Base64**
- No external links needed
- Works offline forever
- Full resolution preserved

---

## 🎯 Benefits

### For Moderators:
✅ **Complete Evidence** - Everything in one file  
✅ **Offline Access** - No need for image hosting  
✅ **Easy Sharing** - Send HTML file to other mods  
✅ **Permanent Record** - Images won't expire  
✅ **Professional Look** - Clean, readable format  

### For Server Owners:
✅ **No Storage Costs** - No need to host images  
✅ **Privacy** - No third-party services  
✅ **Easy Archive** - Just save HTML files  
✅ **Legal Evidence** - Complete audit trail  

---

## 📂 How It Works

### Technical Flow:

1. **Scam Detected**
   - Anti-Scam system identifies suspicious content
   - Message is flagged for deletion

2. **Data Collection** (BEFORE deletion!)
   - Message content captured
   - User info collected
   - Images downloaded from Discord CDN
   - Images converted to Base64

3. **HTML Generation**
   - Beautiful HTML template rendered
   - Images embedded as `data:image/png;base64,...`
   - All data sanitized and escaped

4. **Report Sent**
   - HTML file attached to log message
   - Moderators can download and view
   - Works in ANY browser

5. **Message Deleted**
   - Original message removed
   - Evidence preserved in HTML

---

## 🖼️ Image Embedding

### Why Base64?

**Problem:** When Discord deletes a message, attached images are also deleted from CDN.

**Solution:** Convert images to Base64 and embed directly in HTML:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />
```

**Advantages:**
- ✅ No external dependencies
- ✅ Works offline
- ✅ Images never expire
- ✅ Self-contained report

**Disadvantages:**
- ⚠️ Larger file size (Base64 is ~33% bigger)
- ⚠️ Takes a moment to download images

---

## 📋 Report Format

### File Naming:
```
scam-report-{userId}-{timestamp}.html
```

Example:
```
scam-report-140412945518139090-1735906327845.html
```

### Report Sections:

```
🎯 Detection Results
  - Type: IMAGE
  - Confidence: 100%
  - Reason: Cryptocurrency scam detected

👤 User Information
  - Username: pengutvv
  - User ID: 140412945518139090

🏠 Server & Channel
  - Server: My Discord Server
  - Channel: #media
  - Time: 03 Jun 2026, 12:21

💬 Message Content
  - [Full text here]

📎 Attachments (1)
  - [Image embedded here]
```

---

## 🎨 Styling

The HTML report uses:

- **Modern Design** - Clean, professional look
- **Gradient Header** - Eye-catching red warning
- **Responsive Layout** - Works on mobile too
- **Color-Coded** - Different sections clearly marked
- **High Contrast** - Easy to read

### Color Scheme:
- 🔴 Red: Danger/Scam indicators
- 🟣 Purple: Accent colors
- ⚪ White: Main content area
- ⚫ Gray: Supporting text

---

## 💾 Storage Recommendations

### For Small Servers (<100 members):
- Keep all HTML reports
- Create monthly folders: `/2026-06/`
- Approx. 2-5 MB per report (with images)

### For Large Servers (>1000 members):
- Keep reports for 30 days
- Archive important cases
- Auto-delete old reports
- Consider database logging

### Hosting Options:
1. **Local Storage** (Recommended)
   - Store on bot server
   - No costs
   - Fast access

2. **Cloud Storage**
   - Google Drive
   - Dropbox
   - S3 Bucket

3. **Database**
   - Store HTML as TEXT field
   - Query by user/date
   - More complex but searchable

---

## 🔒 Security & Privacy

### Data Protection:
✅ HTML escaping prevents XSS attacks  
✅ No external scripts or tracking  
✅ Images served from data URIs  
✅ No third-party CDNs  

### GDPR Compliance:
⚠️ Reports contain personal data (User IDs, usernames)  
✅ Only accessible to moderators with log channel access  
✅ Can be deleted upon user request  
✅ Recommend 30-day retention policy  

---

## 🚀 Future Enhancements

Possible features to add:

1. **PDF Export** - Convert HTML to PDF for better archiving
2. **Report Dashboard** - View all reports in web interface
3. **Search Functionality** - Find reports by user/keyword
4. **Bulk Export** - Download multiple reports as ZIP
5. **Analytics** - Charts showing scam trends over time
6. **User Appeal System** - Let users dispute detections

---

## 📊 Example Use Cases

### Use Case 1: User Appeals
**Scenario:** User claims false positive

**Process:**
1. Moderator downloads HTML report
2. Reviews embedded image
3. Checks detection reason
4. Makes informed decision

### Use Case 2: Ban Evidence
**Scenario:** User repeatedly posts scams

**Process:**
1. Collect all HTML reports for that user
2. Show pattern of violations
3. Use as evidence for permanent ban

### Use Case 3: System Improvement
**Scenario:** Too many false positives

**Process:**
1. Review multiple HTML reports
2. Identify common patterns
3. Adjust sensitivity settings
4. Test improvements

---

## ⚙️ Configuration

No configuration needed! Works automatically when:

- ✅ Anti-Scam is enabled
- ✅ Log channel is configured
- ✅ Scam is detected and deleted

---

## 🐛 Troubleshooting

### Report not generated?

**Check:**
1. Is log channel configured?
2. Does bot have permission to send files?
3. Are images publicly accessible?
4. Check bot console for errors

### Images not showing?

**Possible causes:**
1. Image download failed (timeout)
2. Image too large (>8MB Discord limit)
3. Invalid image format

**Solution:**
Report will still be generated with image URL instead of embedded image.

### File too large?

**Discord file size limits:**
- Standard: 8 MB
- Nitro Basic: 50 MB
- Nitro: 500 MB

**Solutions:**
1. Compress images before embedding
2. Link to images instead of embedding
3. Split into multiple reports

---

## 📈 Performance Impact

### Resource Usage:

**CPU:** Low
- HTML generation is fast
- Base64 encoding is efficient

**Memory:** Medium
- Images loaded into memory temporarily
- Garbage collected after report sent

**Network:** Medium
- Downloads images from Discord CDN
- ~1-5 MB per image

**Disk:** None (unless you save reports)

### Optimization Tips:

1. **Limit Image Size**
   ```typescript
   if (imageSize > 5 * 1024 * 1024) { // 5 MB
     // Skip embedding, use URL instead
   }
   ```

2. **Queue System** (already implemented!)
   - Max 5 concurrent image downloads
   - Prevents overwhelming the system

3. **Compression**
   ```typescript
   // Optional: compress before Base64
   const compressed = await sharp(imageBuffer)
     .jpeg({ quality: 80 })
     .toBuffer();
   ```

---

## ✅ Status: Production Ready

This feature is **fully implemented** and ready to use!

**Files:**
- ✅ `apps/bot/src/utils/scamReportGenerator.ts` - HTML generator
- ✅ `apps/bot/src/index.ts` - Integration with Anti-Scam

**Date:** June 3, 2026  
**Version:** 1.0.0  
**Status:** 🟢 Active & Stable  

---

**Powered by your Discord Bot 🤖**
