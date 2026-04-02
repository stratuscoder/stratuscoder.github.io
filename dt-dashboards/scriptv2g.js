function populateCards() {
    const container = document.getElementById('cards-container');

    let cardSections = ``;
    
    // Loop through the card data
    cardData.forEach(cardItem => {
        // Create the card element using template literals
        let tags = ``;
        const cardTags = cardItem.tags;
        cardTags.forEach(cardTag => {
            tags += `<li class="_tag | -trim-both">${cardTag}</li>`;
        });
        
        const cardSection = `
                <section class="_card">
                  <h2 class="_heading | -fluid-text -trim-both" style="--fluid-text--min-font-size: 16;
                  --fluid-text--max-font-size: 24;">${cardItem.title}</h2>
                  <div class="_thumbnail-stack">
                    <img src="${cardItem.image}" alt="" width="400" height="210" fetchpriority="high" />
                    <img src="${cardItem.image}" alt="" width="400" height="210" fetchpriority="high" />
                  </div>
                  <p class="_category | -trim-both">${cardItem.category}</p>
                  <!-- <p class="_price | -trim-both">&yen;2,000</p> -->
                  <p class="_description | -line-clamp">${cardItem.description}</p>
                  <ul class="_tag-list | cluster" style="--cluster--gap: 0.5rem;">${tags}</ul>
                  <div class="_button" style="--purchase-button--background: var(--_accent); --purchase-button--foreground: var(--_accent-contrast);">
                    <button onclick="downloadJsonFromUrl('${cardItem.linkUrl}','${cardItem.fileName}')" class="scope purchase-button">Download Dashboard JSON</button>
                    <!-- <a href="" class="scope purchase-button">Download Dashboard</a> -->
                  </div>
                </section>
        `;
        
        // Insert the HTML string into the content container
        cardSections += cardSection;
    });            
            
    const cardHTML = `
            <div class="scope product-cards | -fluid-text">
              <div class="_card-list | grid" style="
                  --grid--fill-mode: var(--product-cards--fill-mode, auto-fill);
                  --grid--row-gap: var(--product-cards--gap, 1.5rem);
                  --grid--column-gap: var(--product-cards--gap, 1.5rem);
                  --grid--column-max-count: var(--product-cards--column-max-count, 4);
                  --grid--column-min-width: var(--product-cards--column-min-width, 20rem);">
                  ${cardSections}
              </div>
            
              <!-- "display: none" can cause SVG filters to be ineffective in Firefox. -->
              <svg width="0" height="0" style="visibility: hidden; position: fixed;">
                <filter id="svg-inset-shadow">
                  <feOffset in="SourceAlpha" dx="6" dy="8" />
                  <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                  <feComposite in="SourceAlpha" operator="out" />
                  <feBlend in2="SourceGraphic" mode="multiply" />
                </filter>
              </svg>
            </div>
    `;
    
    container.insertAdjacentHTML('beforeend', cardHTML);

}

function downloadJsonFromUrl(url, filename) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Convert JSON object to a string
                const jsonString = JSON.stringify(data, null, 2); 
                // Create a Blob object
                const blob = new Blob([jsonString], { type: 'application/json' });
                // Create a temporary URL for the blob
                const href = URL.createObjectURL(blob);

                // Create a temporary anchor element
                const anchorElement = document.createElement('a');
                anchorElement.href = href;
                anchorElement.download = filename; // Set the proposed file name
                document.body.appendChild(anchorElement); // Required for Firefox

                // Simulate a click to trigger the download
                anchorElement.click();

                // Clean up the temporary URL and element
                document.body.removeChild(anchorElement);
                URL.revokeObjectURL(href);
            })
            .catch(error => {
                console.warn('Something went wrong with the download:', error);
                alert('Could not download the file due to a cross-origin error or network issue.');
            });
}

// 3. Call the function to display the cards when the script loads
populateCards();
