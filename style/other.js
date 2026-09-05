function loadFile(selectedFile) {
  const textContainer = document.getElementById('textContainer');

  if (!selectedFile) {
    textContainer.style.fontSize = '16px';
    textContainer.textContent = '';
    return;
  }

  let fetchPath = selectedFile;
  if (!fetchPath.endsWith(".txt")) {
    fetchPath += ".txt";
  }

  textContainer.style.fontSize = '16px';
  textContainer.textContent = 'लोड हो रहा है...';

  fetch(fetchPath)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      textContainer.innerHTML = '';
      const pre = document.createElement('pre');
      pre.className = 'wrapped-text';
      pre.textContent = data;
      textContainer.appendChild(pre);
    })
    .catch(error => {
      textContainer.textContent = 'सामग्री लोड करने में विफल।';
    });
}

const urlParams = new URLSearchParams(window.location.search);
const fileNameParam = urlParams.get('fetch');
const chooseDropdown = document.getElementById('choose');

if (fileNameParam && chooseDropdown) {
  loadFile(fileNameParam);

  let matchedValue = fileNameParam;
  const options = Array.from(chooseDropdown.options);
  
  const found = options.some(opt => {
    if (opt.value === fileNameParam || opt.value === fileNameParam + '.txt' || opt.value.replace('.txt', '') === fileNameParam.replace('.txt', '')) {
      chooseDropdown.value = opt.value;
      return true;
    }
    return false;
  });
}

if (chooseDropdown) {
  chooseDropdown.addEventListener('change', function() {
    const selectedFile = this.value;
    loadFile(selectedFile);

    if (selectedFile) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('fetch', selectedFile.replace('.txt', ''));
      window.history.pushState({}, '', newUrl);
    }
  });
}