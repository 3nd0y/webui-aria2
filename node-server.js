var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs");

var port = process.argv[2] || 8989;

http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname;

if (uri === "/api/downloads") {
  const folderPath = "C:\\Users\\fmukhtarif\\Downloads\\Aria2";

  fs.readdir(folderPath, function (err, files) {
    if (err) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: err.toString() }));
      return;
    }

    const result = files
      .map(file => {
        const fullPath = path.join(folderPath, file);
        const stats = fs.statSync(fullPath);
        return { file, stats };
      })
      .filter(item => item.stats.isFile())
      .map(item => ({
        name: item.file,
        size: item.stats.size,
        isDirectory: false
      }));

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result));
  });
  return;
}



  // Menyajikan file dari C:\downloads
  if (uri.startsWith("/downloads/") && uri !== "/downloads") {
    const requestedFile = decodeURIComponent(uri.replace("/downloads/", ""));
    const filePath = path.join("C:\\Users\\fmukhtarif\\Downloads\\Aria2", requestedFile);

    fs.exists(filePath, function (exists) {
      if (!exists) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("File not found");
        return;
      }

      fs.readFile(filePath, function (err, data) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.end("Error reading file");
          return;
        }

        response.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
        });
        response.end(data);
      });
    });
    return;
  }

  // Jika akses /downloads, tampilkan download.html
  if (uri === "/downloads") {
    const htmlPath = path.join(process.cwd(), "docs", "downloads.html");

    fs.readFile(htmlPath, function (err, data) {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Error loading downloads.html");
        return;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(data);
    });
    return;
  }

  // Default: file dari folder docs
  var filename = path.join(process.cwd(), "docs", uri);
  var extname = path.extname(filename);
  var contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".ico":
      contentType = "image/x-icon";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
  }

  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 Not Found\n");
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += "/index.html";

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end(err + "\n");
        return;
      }

      response.writeHead(200, { "Content-Type": contentType });
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Server jalan di http://localhost:" + port);
