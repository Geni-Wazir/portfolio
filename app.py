from flask import Flask, render_template
import feedparser
from bs4 import BeautifulSoup
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html', title='Saurabh Kumar')

@app.route('/experience')
def experience():
    return render_template('experience.html', title='Saurabh Kumar - Experience')


@app.route('/achievements')
def achievements():
    return render_template('achievements.html', title='Saurabh Kumar - Achievements')


@app.route('/projects')
def projects():
    return render_template('projects.html', title='Saurabh Kumar - Projects')


@app.route('/blogs')
def blogs():
    blogs = []
    try:
        url = "https://medium.com/feed/@geniwazir"
        feed = feedparser.parse(url)
        for entry in feed.entries:
            post={}
            post['title'] = entry.title
            post['author'] = entry.author
            post['url'] = entry.link
            date_object = datetime.strptime(entry.published, "%a, %d %b %Y %H:%M:%S %Z")
            post['date'] = date_object
            soup = BeautifulSoup(entry.summary, "html.parser")
            image_tag = soup.find("img")
            post['image']  = image_tag['src'] if image_tag and 'src' in image_tag.attrs else ''
            post['tags'] = [tag['term'] for tag in entry.tags]
            blogs.append(post)
    except:
        pass

    return render_template('blogs.html', title='Saurabh Kumar - Blogs', blogs=blogs)
