export function renderArticles(articles) {
    console.log('Type of articles:', typeof articles);
    console.log('Value of articles:', articles);

    const articlesContainer = document.getElementById('articles-container');
    articlesContainer.innerHTML = ''; // Clear existing articles

    if (!articles || articles.length === 0) {
        articlesContainer.innerHTML = '<p>No articles found.</p>';
        return;
    }

    articles.forEach(article => {
        const articleWrapper = document.createElement('article');
    articleWrapper.classList.add(
        'article',
        'mb-6',
        'rounded-lg',
        'overflow-hidden',
        'border',
        'border-gray-200',
        'shadow-sm',
        'hover:shadow-md',
        'transition-all',
        'ease-in-out',
        'duration-300',
        'hover:scale-[1.02]',
        'cursor-pointer'
    );


        // Image (only if media_url exists)
        if (article.media_url) {
            const imgDiv = document.createElement('a');
            imgDiv.classList.add('article-image');
            imgDiv.addEventListener('click', () => {
                window.location.href = `article.html?id=${article.id}`;
            });

            const img = document.createElement('img');
            img.src = article.media_url || 'https://placehold.co/800x400/png?text=No+Image';
            img.alt = article.media_alt || article.title;
            img.classList.add('w-full', 'h-48', 'object-cover');

            imgDiv.appendChild(img);
            articleWrapper.appendChild(imgDiv);
        }

        // Content wrapper
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('p-4');

        const title = document.createElement('h2');
        title.textContent = article.title;
        title.classList.add('text-xl', 'font-semibold', 'mb-2');

        const body = document.createElement('p');
        body.textContent = article.body;
        body.classList.add('text-gray-700', 'mb-3');

        const meta = document.createElement('div');
        meta.classList.add('text-sm', 'text-gray-500');
        meta.textContent = `By ${article.email} · ${new Date(article.createdAt).toLocaleDateString()}`;

        contentDiv.appendChild(title);
        contentDiv.appendChild(body);
        contentDiv.appendChild(meta);

        articleWrapper.appendChild(contentDiv);
        articlesContainer.appendChild(articleWrapper);
    });
}

export function renderSingleArticle(article) {
    console.log('Rendering single article:', article);
    const articleContainer = document.getElementById('article-container');  
    articleContainer.innerHTML = ''; // Clear existing content

    if (!article) {
        articleContainer.innerHTML = '<p>Article not found.</p>';
        return;
    }   
    const articleWrapper = document.createElement('article');
    articleWrapper.classList.add(
    'article',
    'mb-6',
    'rounded-lg',
    'overflow-hidden',
    'border',
    'border-gray-200',
    'shadow-sm',
    'p-6',
    'bg-white',
    'max-w-3xl',
    'mx-auto'
    );
    // Image (only if media_url exists)
    if (article.media_url) {
        const img = document.createElement('img');
        img.src = article.media_url || 'https://placehold.co/800x400/png?text=No+Image';
        img.alt = article.media_alt || article.title;
        img.classList.add(
        'w-full',
        'max-h-96',
        'object-cover',
        'rounded-md',
        'mb-4'
        );

        articleWrapper.appendChild(img);
    }
    const title = document.createElement('h1');
    title.textContent = article.title;
    title.classList.add('text-3xl', 'font-bold', 'mb-4');   
    const body = document.createElement('p');
    body.textContent = article.body;
    body.classList.add('text-gray-800', 'mb-6');   
    const meta = document.createElement('div');
    meta.classList.add('text-sm', 'text-gray-500', 'mb-4');
    meta.textContent = `By ${article.email} · ${new Date(article.createdAt).toLocaleDateString()}`;   
    articleWrapper.appendChild(title);
    articleWrapper.appendChild(meta);
    articleWrapper.appendChild(body);   
    articleContainer.appendChild(articleWrapper);
}