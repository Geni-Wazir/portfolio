from flask import Flask, render_template, send_from_directory, Response, url_for
import feedparser
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlparse, urlunparse


app = Flask(__name__)

SITE_URL = "https://geniwazir.vercel.app"
SITE_NAME = "Saurabh Kumar | Geni Wazir"

PAGE_SEO = {
    'home': {
        'path': '/',
        'title': 'Saurabh Kumar | Geni Wazir — Security Researcher & Penetration Tester',
        'description': 'Saurabh Kumar, known online as Geni Wazir, is a cybersecurity professional and penetration tester specializing in vulnerability research, bug bounty mediation and AI-powered security automation. Explore his experience, certifications and projects.',
        'keywords': 'Saurabh Kumar, Geni Wazir, GeniWazir, Geni_Wazir, penetration tester, pentester, ethical hacker, hacker, security researcher, cybersecurity professional, bug bounty hunter, vulnerability researcher, HackerOne, AI automation engineer',
    },
    'experience': {
        'path': '/experience',
        'title': 'Experience — Saurabh Kumar (Geni Wazir) | Security Researcher & Mediation Specialist',
        'description': 'Professional experience of Saurabh Kumar (Geni Wazir): Mediation Specialist III at HackerOne, Information Security Analyst at Astra Security, and Cyber Security Analyst at Digisec360 — securing 500+ web apps, APIs, cloud and network systems.',
        'keywords': 'Saurabh Kumar experience, Geni Wazir, HackerOne mediation specialist, Astra Security analyst, penetration tester experience, security researcher career, vulnerability triage, bug bounty mediation',
    },
    'achievements': {
        'path': '/achievements',
        'title': 'Achievements — Saurabh Kumar (Geni Wazir) | OSCP, CPTS, CEH Certified Pentester',
        'description': 'Certifications and speaking engagements of Saurabh Kumar (Geni Wazir): OSCP, CPTS, CEH and OCI certified penetration tester, and guest speaker on ethical hacking and cybersecurity.',
        'keywords': 'Saurabh Kumar certifications, Geni Wazir, OSCP, CPTS, CEH, OCI security, certified penetration tester, ethical hacker certifications, cybersecurity speaker',
    },
    'projects': {
        'path': '/projects',
        'title': 'Projects — Saurabh Kumar (Geni Wazir) | Security Tools & Automation Projects',
        'description': 'Security and automation projects built by Saurabh Kumar (Geni Wazir), including the Chowkidar vulnerability scanner, AI chatbot plugins, Kubernetes automation and offensive security tooling.',
        'keywords': 'Saurabh Kumar projects, Geni Wazir, Chowkidar vulnerability scanner, penetration testing tools, security automation projects, hacking tools, Python security scripts',
    },
    'blogs': {
        'path': '/blogs',
        'title': 'Blogs — Saurabh Kumar (Geni Wazir) | Cybersecurity, Hacking & AI Articles',
        'description': 'Cybersecurity and AI articles by Saurabh Kumar (Geni Wazir) covering ethical hacking, bug bounty mediation, penetration testing, automation and practical security research.',
        'keywords': 'Saurabh Kumar blog, Geni Wazir, cybersecurity blog, ethical hacking articles, bug bounty writeups, penetration testing blog, AI security automation',
    },
    'resume': {
        'path': '/resume',
        'title': 'Resume — Saurabh Kumar (Geni Wazir) | Penetration Tester & Security Researcher',
        'description': 'Resume of Saurabh Kumar (Geni Wazir), cybersecurity professional and penetration tester with experience at HackerOne and Astra Security, OSCP/CPTS/CEH certified.',
        'keywords': 'Saurabh Kumar resume, Geni Wazir CV, penetration tester resume, security researcher resume, hire ethical hacker',
    },
}


@app.context_processor
def inject_site_meta():
    return {
        'site_url': SITE_URL,
        'site_name': SITE_NAME,
        'default_og_image': SITE_URL + url_for('static', filename='hero/hero-light.png'),
    }


def seo_context(key):
    data = PAGE_SEO[key].copy()
    data['canonical'] = SITE_URL + data.pop('path')
    return data


@app.route('/')
def home():
    return render_template('home.html', **seo_context('home'))

@app.route('/experience')
def experience():
    return render_template('experience.html', **seo_context('experience'))


@app.route('/achievements')
def achievements():
    return render_template('achievements.html', **seo_context('achievements'))


@app.route('/projects')
def projects():
    return render_template('projects.html', **seo_context('projects'))


@app.route('/resume')
def resume():
    return render_template('resume.html', **seo_context('resume'))


@app.route('/resume/download')
def resume_download():
    return send_from_directory(app.static_folder, 'documents/saurabh-kumar-resume.pdf', as_attachment=True)


@app.route('/robots.txt')
def robots_txt():
    return send_from_directory(app.static_folder, 'robots.txt', mimetype='text/plain')


@app.route('/sitemap.xml')
def sitemap_xml():
    return send_from_directory(app.static_folder, 'sitemap.xml', mimetype='application/xml')


@app.route('/llms.txt')
def llms_txt():
    content = f"""# Saurabh Kumar (Geni Wazir)

> Cybersecurity professional, penetration tester and security researcher. Mediation Specialist III at HackerOne, previously Information Security Analyst at Astra Security and Cyber Security Analyst at Digisec360. OSCP, CPTS, CEH and OCI certified. Builds AI-powered security automation and offensive security tooling.

Also known online as: Geni Wazir, GeniWazir, Geni_Wazir.

## Pages

- [Home]({SITE_URL}/): Introduction and overview of Saurabh Kumar's background as a security researcher and penetration tester.
- [Experience]({SITE_URL}/experience): Professional history at HackerOne, Astra Security and Digisec360.
- [Achievements]({SITE_URL}/achievements): Certifications (OSCP, CPTS, CEH, OCI) and guest speaking engagements.
- [Projects]({SITE_URL}/projects): Security tools and automation projects, including the Chowkidar vulnerability scanner.
- [Blogs]({SITE_URL}/blogs): Articles on cybersecurity, ethical hacking, bug bounty and AI.
- [Resume]({SITE_URL}/resume): Full resume/CV, downloadable as PDF.

## Links

- LinkedIn: https://www.linkedin.com/in/saurabh-kumar-5780b4203/
- GitHub: https://github.com/Geni-Wazir
- Medium (blog): https://medium.com/@geniwazir
- Book a call: https://topmate.io/saurabh_kumar0
"""
    return Response(content, mimetype='text/plain')


CATEGORY_KEYWORDS = [
    ('Security', ['hack', 'security', 'penetration', 'vulnerab', 'exploit', 'ctf', 'bug-bounty', 'mediation', 'request-smuggling', 'desync']),
    ('AI & LLMs', ['llm', 'gpt', 'chatgpt', 'openai', 'machine-learning', 'artificial-intelligence', 'genai', 'nlp', 'chatbot', 'prompt-engineering']),
    ('Automation', ['automation', 'script', 'python', 'bot', 'workflow']),
    ('Development', ['development', 'web', 'api', 'code', 'programming', 'react', 'flask', 'backend', 'frontend']),
    ('Tools', ['tool', 'cli', 'utility', 'extension', 'plugin']),
    ('Career', ['career', 'interview', 'job', 'growth', 'journey']),
]


def categorize(tags):
    lowered = [t.lower() for t in tags]
    for category, keywords in CATEGORY_KEYWORDS:
        if any(keyword in tag for tag in lowered for keyword in keywords):
            return category
    return 'Other'


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
            post['url'] = urlunparse(urlparse(entry.link)._replace(query=""))
            date_object = datetime.strptime(entry.published, "%a, %d %b %Y %H:%M:%S %Z")
            post['date'] = date_object
            soup = BeautifulSoup(entry.summary, "html.parser")
            image_tag = soup.find("img")
            post['image']  = image_tag['src'] if image_tag and 'src' in image_tag.attrs else ''
            post['tags'] = [tag['term'] for tag in entry.tags]
            excerpt_text = soup.get_text(separator=' ', strip=True)
            post['excerpt'] = (excerpt_text[:180].rsplit(' ', 1)[0] + '...') if len(excerpt_text) > 180 else excerpt_text
            post['read_time'] = max(1, round(len(excerpt_text.split()) / 200)) if excerpt_text else 1
            post['category'] = categorize(post['tags'])
            blogs.append(post)
    except:
        pass

    return render_template('blogs.html', blogs=blogs, **seo_context('blogs'))
