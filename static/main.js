
document.getElementById('current-year').textContent = new Date().getFullYear();

const circle = document.querySelector('.circle');
const items = document.querySelectorAll('.item');

// Detect current rotation and highlight the front-facing item
function updateLabels() {
    const computedStyle = getComputedStyle(circle);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);

    // Calculate the rotation angle in degrees
    const angle = Math.atan2(matrix.m13, matrix.m11) * (180 / Math.PI);

    items.forEach((item, index) => {
        const itemAngle = index * 72; // Each item is 72 degrees apart
        const adjustedAngle = (angle % 360 + 360) % 360; // Normalize angle to [0, 360]
        const diff = Math.abs(adjustedAngle - itemAngle);

        if (diff < 65 || diff > 300) {
            // Highlight the front-facing item
            item.style.opacity = '1';
            item.querySelector('.label').style.opacity = '1';
        } else {
            // Dim the other items
            item.style.opacity = '0.1';
            item.querySelector('.label').style.opacity = '0';
        }
    });
}

if (circle){
    // Update the labels every frame during animation
    setInterval(updateLabels, 100); // Adjust interval for smoother updates if needed
}




const spider = document.querySelector('.spider');
const webContainer = document.getElementById('web-container');
const svgElementFire = document.getElementById('blast-spider');

// Check if all necessary elements are present
if (spider && webContainer && svgElementFire) {
    // Store current position of the spider
    let currentX = 50;
    let currentY = 50;

    // Store the click counter
    let clickCount = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    console.log(bestScore);

    // Update the best score in the UI if it's available
    if (bestScore) {
        document.getElementById('best-score').textContent = bestScore;
    }

    // Function to generate a random position within the web container
    function getRandomPosition() {
        const maxX = webContainer.clientWidth - 30; // Account for the spider's size
        const maxY = webContainer.clientHeight - 30; // Account for the spider's size
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        return { x, y };
    }

    // Function to animate the spider's movement
    function animateSpider() {
        const { x, y } = getRandomPosition();
        let startX = currentX;
        let startY = currentY;
        let endX = x;
        let endY = y;

        const duration = 1000; // Animation duration in ms
        let startTime = null;

        function move(time) {
            if (!startTime) startTime = time;
            const progress = (time - startTime) / duration;

            if (progress < 1) {
                currentX = startX + (endX - startX) * progress;
                currentY = startY + (endY - startY) * progress;
                spider.style.left = `${currentX}px`;
                spider.style.top = `${currentY}px`;
                requestAnimationFrame(move);
            } else {
                currentX = endX;
                currentY = endY;
                spider.style.left = `${currentX}px`;
                spider.style.top = `${currentY}px`;
            }
        }

        requestAnimationFrame(move);
    }

    // Function to handle spider click
    function handleSpiderClick() {
        clickCount++;
        spider.style.display = 'none'; // Hide the spider
        svgElementFire.style.left = `${currentX}px`;
        svgElementFire.style.top = `${currentY}px`;
        svgElementFire.style.display = 'block'; // Show the SVG

        // Update the score in the UI
        document.getElementById('score').textContent = clickCount;

        // Check if current click count is a new best score
        if (clickCount > bestScore) {
            bestScore = clickCount;
            localStorage.setItem('bestScore', bestScore); // Update best score in localStorage
            document.getElementById('best-score').textContent = bestScore; // Update the best score UI
            console.log('New Best Score:', bestScore);
        }

        setTimeout(() => {
            svgElementFire.style.display = 'none'; // Hide the SVG
            const { x, y } = getRandomPosition();
            currentX = x;
            currentY = y;
            spider.style.left = `${currentX}px`;
            spider.style.top = `${currentY}px`;
            spider.style.display = 'block'; // Show the spider again
        }, 600);
    }

    // Function to handle clicks outside the spider
    function handleOutsideClick(event) {
        if (!spider.contains(event.target)) {
            clickCount = 0; // Reset click count if clicked outside the spider
            document.getElementById('score').textContent = clickCount; // Update score UI
        }
    }

    // Add click event listener to the spider
    spider.addEventListener('click', handleSpiderClick);

    // Add event listener to detect clicks outside the spider
    document.addEventListener('click', handleOutsideClick);

    // Continuously move the spider every 2 seconds
    setInterval(animateSpider, 1500);
}




const searchInput = document.getElementById('search-blog');
const blogGrid = document.getElementById('blogs');
const notFound = document.getElementById('notFound');

if (searchInput && blogGrid && notFound) {
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const blogs = blogGrid.querySelectorAll('.blog-card'); // Select all blog cards with a specific class
        let hasVisibleBlogs = false;

        // Show all blogs and hide "not found" if search input is empty
        if (searchTerm.trim() === '') {
            blogs.forEach(blog => {
                blog.classList.remove('hidden'); // Remove the hidden class to show all blogs
            });
            notFound.classList.add('hidden'); // Hide the "not found" container
            return;
        }

        blogs.forEach(blog => {
            // Combine all the text content of the blog
            const blogText = blog.innerText.toLowerCase();

            // Show the blog card if the search term matches any part of its text
            if (blogText.includes(searchTerm)) {
                blog.classList.remove('hidden'); // Show the blog
                hasVisibleBlogs = true; // At least one blog matches
            } else {
                blog.classList.add('hidden'); // Hide the blog
            }
        });

        // Show the notFound container if no blogs are visible
        if (hasVisibleBlogs) {
            notFound.classList.add('hidden'); // Hide the "not found" container
        } else {
            notFound.classList.remove('hidden'); // Show the "not found" container
        }
    });
}



