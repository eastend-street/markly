package services

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type ImageCaptureService struct {
	storageDir string
	baseURL    string
}

type CaptureResult struct {
	FaviconURL    *string
	ScreenshotURL *string
	Error         error
}

func NewImageCaptureService(storageDir, baseURL string) *ImageCaptureService {
	return &ImageCaptureService{
		storageDir: storageDir,
		baseURL:    baseURL,
	}
}

func (s *ImageCaptureService) CaptureImages(targetURL string) *CaptureResult {
	result := &CaptureResult{}

	// Ensure storage directory exists
	if err := os.MkdirAll(s.storageDir, 0755); err != nil {
		result.Error = fmt.Errorf("failed to create storage directory: %w", err)
		return result
	}

	// Capture favicon
	if faviconURL := s.captureFavicon(targetURL); faviconURL != nil {
		result.FaviconURL = faviconURL
	}

	// Capture screenshot
	if screenshotURL := s.captureScreenshot(targetURL); screenshotURL != nil {
		result.ScreenshotURL = screenshotURL
	}

	return result
}

func (s *ImageCaptureService) captureFavicon(targetURL string) *string {
	// Try multiple favicon locations
	faviconURLs := s.getFaviconURLs(targetURL)
	
	for _, faviconURL := range faviconURLs {
		if localPath := s.downloadImage(faviconURL, "favicon"); localPath != nil {
			publicURL := fmt.Sprintf("%s/images/%s", s.baseURL, filepath.Base(*localPath))
			return &publicURL
		}
	}
	
	return nil
}

func (s *ImageCaptureService) getFaviconURLs(targetURL string) []string {
	parsedURL, err := url.Parse(targetURL)
	if err != nil {
		return nil
	}

	baseURL := fmt.Sprintf("%s://%s", parsedURL.Scheme, parsedURL.Host)
	
	// Try common favicon locations
	return []string{
		baseURL + "/favicon.ico",
		baseURL + "/favicon.png",
		baseURL + "/apple-touch-icon.png",
		baseURL + "/apple-touch-icon-precomposed.png",
	}
}

func (s *ImageCaptureService) downloadImage(imageURL, prefix string) *string {
	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	resp, err := client.Get(imageURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		return nil
	}
	defer resp.Body.Close()

	// Generate filename
	timestamp := time.Now().Unix()
	ext := ".ico"
	if strings.Contains(resp.Header.Get("Content-Type"), "png") {
		ext = ".png"
	} else if strings.Contains(resp.Header.Get("Content-Type"), "jpeg") {
		ext = ".jpg"
	}
	
	filename := fmt.Sprintf("%s_%d%s", prefix, timestamp, ext)
	filepath := filepath.Join(s.storageDir, filename)

	// Create file
	file, err := os.Create(filepath)
	if err != nil {
		return nil
	}
	defer file.Close()

	// Copy image data
	if _, err := io.Copy(file, resp.Body); err != nil {
		os.Remove(filepath)
		return nil
	}

	return &filename
}

func (s *ImageCaptureService) captureScreenshot(targetURL string) *string {
	// For now, skip screenshot capture in development to avoid Chrome dependency issues
	// In production, you would want to ensure Chrome/Chromium is available in the Docker image
	
	// TODO: Implement screenshot capture when Chrome is available
	// This could be enabled via environment variable or configuration
	return nil
	
	/*
	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Create chromedp context
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("disable-web-security", true),
		chromedp.Flag("disable-extensions", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.WindowSize(1200, 800),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(ctx, opts...)
	defer cancel()

	taskCtx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// Generate filename
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("screenshot_%d.png", timestamp)
	filepath := filepath.Join(s.storageDir, filename)

	var buf []byte
	
	// Navigate to URL and take screenshot
	err := chromedp.Run(taskCtx,
		chromedp.Navigate(targetURL),
		chromedp.WaitVisible("body", chromedp.ByQuery),
		chromedp.Sleep(2*time.Second), // Wait for content to load
		chromedp.CaptureScreenshot(&buf),
	)

	if err != nil {
		return nil
	}

	// Save screenshot
	if err := os.WriteFile(filepath, buf, 0644); err != nil {
		return nil
	}

	publicURL := fmt.Sprintf("%s/images/%s", s.baseURL, filename)
	return &publicURL
	*/
}