const request = require('supertest');
const path = require('path');
const app = require('./app');

describe('File Upload Endpoint', () => {
  it('should upload a single file successfully', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('files', path.join(__dirname, 'test-files/single-file.txt'));
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('Files uploaded successfully: single-file.txt');
  });

  it('should upload multiple files successfully', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('files', path.join(__dirname, 'test-files/file1.txt'))
      .attach('files', path.join(__dirname, 'test-files/file2.txt'));

    expect(response.status).toBe(200);
    expect(response.text).toContain('Files uploaded successfully');
  });

  it('should return an error when no files are uploaded', async () => {
    const response = await request(app)
      .post('/upload'); // No files attached

    expect(response.status).toBe(400);
    expect(response.text).toBe('No files uploaded.');
  });
});