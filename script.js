// 在文件开头添加这个函数
function addTechGlowEffect(element) {
    element.classList.add('tech-glow');
}

// 获取图片列表并设置轮播图
async function setupCarousel() {
    const carousel = document.getElementById('carousel');
    const imageFiles = await getImageFiles();

    console.log('Image files:', imageFiles); // 调试信息

    if (imageFiles.length === 0) {
        console.warn('No images found in the images directory.');
        return;
    }

    imageFiles.forEach((file, index) => {
        const img = document.createElement('img');
        img.src = `images/${file}`;
        img.alt = `Tech Image ${index + 1}`;
        carousel.appendChild(img);
        console.log(`Added image: ${file}`); // 调试信息
    });

    const images = carousel.querySelectorAll('img');
    console.log(`Total images added: ${images.length}`); // 调试信息

    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
        console.log(`Showing image ${currentIndex + 1}`); // 调试信息
    }

    images[currentIndex].classList.add('active');
    console.log('Initial image set to active'); // 调试信息
    
    if (images.length > 1) {
        setInterval(showNextImage, 5000);
        console.log('Carousel interval set'); // 调试信息
    }
}

// 加载Markdown文章
async function loadMarkdown(filePath, folder) {
    try {
        const response = await fetch(`${folder}/${filePath}`);
        const text = await response.text();
        document.getElementById('content').innerHTML = marked.parse(text);
        // 隐藏所有列表，显示文章内容
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('content').style.display = 'block';
    } catch (error) {
        console.error('Error loading Markdown file:', error);
        document.getElementById('content').innerHTML = '<p>Error loading content.</p>';
    }
}

// 创建通用的加载列表函数
async function loadList(listId, searchInputId, folder) {
    const list = document.getElementById(listId);
    const searchInput = document.getElementById(searchInputId);
    
    try {
        const response = await fetch(`get_markdown_files.php?folder=${folder}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();

        function renderItems(itemsToRender) {
            list.innerHTML = ''; // 清空现有列表
            itemsToRender.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = item.title;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadMarkdown(item.file, folder);
                });
                li.appendChild(a);
                list.appendChild(li);
            });
        }

        renderItems(items);

        // 添加搜索功能
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredItems = items.filter(item => 
                item.title.toLowerCase().includes(searchTerm)
            );
            renderItems(filteredItems);
        });

    } catch (error) {
        console.error(`Error loading ${folder} list:`, error);
        list.innerHTML = `<li>Error loading ${folder} list.</li>`;
    }
}

// 添加加载项目列表函数
function loadProjectList() {
    const projectList = document.getElementById('project-list');
    const projects = [
        { title: '基于深度学习的图像识别系统', description: '使用TensorFlow实现的实时物体识别应用' },
        { title: '去中心化金融（DeFi）平台', description: '基于以太坊的智能合约开发的DeFi应用' },
        { title: '微服务架构的电商平台', description: '使用Spring Cloud和Docker构建的高可用电商系统' },
        // 添加更多项目...
    ];

    projects.forEach(project => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        h3.textContent = project.title;
        const p = document.createElement('p');
        p.textContent = project.description;
        li.appendChild(h3);
        li.appendChild(p);
        projectList.appendChild(li);
    });
}

// 获取 images 目录下的图片文件列表
async function getImageFiles() {
    try {
        const response = await fetch('get_image_files.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageFiles = await response.json();
        return imageFiles;
    } catch (error) {
        console.error('Error fetching image files:', error);
        return [];
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded'); // 调试信息
    setupCarousel();
    loadList('article-list', 'search-input', 'Doc');
    loadList('diary-list', 'diary-search-input', 'Diary');
    loadList('notes-list', 'notes-search-input', 'Notes');
    setupCursorGlow();
    
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            document.querySelectorAll('main > section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(targetId).style.display = 'block';
            document.getElementById('content').style.display = 'none';
        });
    });

    document.getElementById('home').style.display = 'block';
    document.getElementById('about').style.display = 'none';
    document.getElementById('articles').style.display = 'none';
    document.getElementById('diary').style.display = 'none';
    document.getElementById('notes').style.display = 'none';
    document.getElementById('content').style.display = 'none';
});

// 在文件末尾添加以下函数

function setupCursorGlow() {
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX - 25 + 'px';
        cursorGlow.style.top = e.clientY - 25 + 'px';
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    const interactiveElements = document.querySelectorAll('a, button, input, #carousel, #about, #articles, #projects');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('hover');
        });
    });
}
