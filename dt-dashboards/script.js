// 1. JavaScript JSON variable containing the items
const cardData = [
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
    },
    {
        image: './dashboards/fsadaptivetrafficmgmt.png',
        title: 'Full Stack Adaptive Traffic Management',
        description: 'Shows Full Stack adaptive traffic management.',
        linkUrl: './dashboards/fsadaptivetrafficmgmt.json',
        linkText: 'Download Dashboard'
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

// 3. Call the function to display the cards when the script loads
populateCards();
