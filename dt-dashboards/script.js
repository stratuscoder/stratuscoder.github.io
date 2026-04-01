// 1. JavaScript JSON variable containing the items
const cardData = [
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard',
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'.
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard',
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]        
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard',
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]        
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard',
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]        
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard',
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard',
        category: 'OneAgent',
        tags: [
            "OneAgent", "Traffic", "Gen3"
        ]        
    }
    // Add more items as needed
];

// 2. Function to populate the grid
function populateCards() {
    const container = document.getElementById('cards-container');
    
    // Loop through the card data
    cardData.forEach(cardItem => {
        // Create the card element using template literals
        const cardHTML = `
            <div class="card">
                <img src="${cardItem.image}" alt="${cardItem.title}">
                <div class="card-content">
                    <h2>${cardItem.title}</h2>
                    <p>${cardItem.description}</p>
                </div>
                <a href="${cardItem.linkUrl}" class="card-link">${cardItem.linkText}</a>
            </div>
        `;

        // Insert the HTML string into the container
        // Using insertAdjacentHTML is efficient for adding many elements
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function popluateCardsV2() {
    const container = document.getElementById('cards-container');

    const cardHTMLPre = `
            <div class="scope product-cards | -fluid-text">
              <div class="_card-list | grid" style="
                  --grid--fill-mode: var(--product-cards--fill-mode, auto-fill);
                  --grid--row-gap: var(--product-cards--gap, 1.5rem);
                  --grid--column-gap: var(--product-cards--gap, 1.5rem);
                  --grid--column-max-count: var(--product-cards--column-max-count, 4);
                  --grid--column-min-width: var(--product-cards--column-min-width, 20rem);">
    `;

    let cardHTML = cardHTMLPre;
    
    // Loop through the card data
    cardData.forEach(cardItem => {
        // Create the card element using template literals
        let cardTags = ``;
        cardData.tags.forEach(cardTag => {
            cardTags += `<li class="_tag | -trim-both">${cardTag}</li>`;
        }
        
        const cardHTMLSection = `
                <section class="_card">
                  <h2 class="_heading | -fluid-text -trim-both" style="--fluid-text--min-font-size: 16;
                  --fluid-text--max-font-size: 24;">${cardItem.title}</h2>
                  <div class="_thumbnail-stack">
                    <img src="${cardItem.image}" alt="" width="400" height="210" fetchpriority="high" />
                    <img src="${cardItem.image}" alt="" width="400" height="210" fetchpriority="high" />
                  </div>
                  <p class="_category | -trim-both">${cardItem.category}</p>
                  <p class="_price | -trim-both">&yen;2,000</p>
                  <p class="_description | -line-clamp">${cardItem.description}</p>
                  <ul class="_tag-list | cluster" style="--cluster--gap: 0.5rem;">${cardTags}</ul>
                  <div class="_button" style="--purchase-button--background: var(--_accent); --purchase-button--foreground: var(--_accent-contrast);">
                    <a href="${cardItem.linkUrl}" class="scope purchase-button">Download Dashboard</a>
                  </div>
                </section>
        `;
        
        // Insert the HTML string into the container
        cardHTML += cardHTMLSection
    });            
            
    const cardHTMLPost = `
              </div>
            
              <!-- `display: none` can cause SVG filters to be ineffective in Firefox. -->
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
    
    cardHTML += cardHTMLPost

    container.insertAdjacentHTML('beforeend', cardHTML);


}

// 3. Call the function to display the cards when the script loads
populateCardsV2();
