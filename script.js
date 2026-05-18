async function processImage(file, format) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(event) {
      const img = new Image();

      img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const converted = canvas.toDataURL(format);
        resolve({
          dataUrl: converted,
          name: file.name.split('.')[0]
        });
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function handleConvert() {
  const fileInput = document.getElementById("upload");
  const format = document.getElementById("format").value;
  const container = document.getElementById("download-container");

  if (!fileInput.files.length) {
    alert("Please select at least one image");
    return;
  }

  if (format === "image/svg+xml") {
    alert("SVG conversion is currently not supported in this version.");
    return;
  }

  // Clear previous downloads
  container.innerHTML = "";

  const files = Array.from(fileInput.files);
  
  for (const file of files) {
    try {
      const result = await processImage(file, format);
      
      const extension = format.split('/')[1].replace('+xml', '').split(';')[0];
      const downloadLink = document.createElement("a");
      
      downloadLink.href = result.dataUrl;
      downloadLink.download = `${result.name}-converted.${extension}`;
      
      // Styling the link as a button with Tailwind CSS
      downloadLink.className = "flex items-center justify-between p-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all group";
      
      // Creating the label and icon inner HTML
      downloadLink.innerHTML = `
        <span class="text-sm font-medium truncate mr-2">${result.name}-converted.${extension}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      `;
      
      container.appendChild(downloadLink);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
    }
  }
}
