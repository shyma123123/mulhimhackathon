# SmartShield Test Dataset

This directory contains test datasets for validating the SmartShield phishing detection system.

## Dataset Overview

- **Total Samples**: 100
- **Phishing Samples**: 50
- **Clean Samples**: 50
- **Categories**: Various phishing types and legitimate content

## File Structure

```
test-dataset/
├── phishing-samples.json     # Main test dataset
├── email-samples.json        # Email-specific samples
├── url-samples.json         # URL-focused samples
└── README.md               # This file
```

## Sample Categories

### Phishing Types
1. **Credential Harvesting**: Fake login pages and credential theft
2. **Banking Scams**: Fake bank security alerts
3. **Tech Support Scams**: Fake tech support and software downloads
4. **Social Media Scams**: Fake social media security alerts
5. **Government Impersonation**: Fake government agency communications

### Clean Content Types
1. **Legitimate News**: Real news articles about cybersecurity
2. **Educational Content**: Educational materials about security
3. **Legitimate Business**: Official business communications
4. **Software Updates**: Legitimate software update notifications

## Usage

### Testing Detection Accuracy
```bash
# Run the test suite
npm run test:detection

# Test with specific samples
npm run test:detection -- --sample-id 1,2,3
```

### Validation Metrics
- **True Positive Rate**: Correctly identified phishing samples
- **True Negative Rate**: Correctly identified clean samples
- **False Positive Rate**: Clean samples incorrectly flagged as phishing
- **False Negative Rate**: Phishing samples not detected

## Expected Performance

- **Detection Accuracy**: > 90%
- **False Positive Rate**: < 5%
- **Processing Time**: < 3 seconds per sample

## Privacy Notice

All sensitive information in the test samples has been:
- Redacted with [REDACTED] placeholders
- Replaced with fictional data
- Anonymized to protect privacy

## Contributing

When adding new test samples:
1. Follow the existing JSON structure
2. Include realistic but fictional content
3. Redact all sensitive information
4. Provide expected detection reasons
5. Update the total count in metadata
