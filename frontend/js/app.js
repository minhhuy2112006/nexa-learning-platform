const pages = [...document.querySelectorAll('.app-page')];
const messageUtility = document.querySelector('.side-footer button[aria-label="Messages"]');
if (messageUtility) messageUtility.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z"/><path d="M8 10h8M8 14h5"/></svg>';
const profilePill = document.querySelector('.student-pill');
if (profilePill) profilePill.outerHTML = '<div class="profile-menu-wrap"><button class="student-pill" type="button" data-profile-menu-toggle aria-expanded="false" aria-controls="profile-menu" aria-label="Open profile menu"><i>VA</i></button><span class="header-profile-name">Vân Anh</span><b class="header-profile-arrow">⌄</b><div class="profile-menu" id="profile-menu" role="menu" hidden><button type="button" data-route="profile" role="menuitem">Hồ sơ</button><button type="button" data-route="settings" role="menuitem">Cài đặt</button><button type="button" data-route="ai-study" role="menuitem">Trợ giúp</button><button type="button" class="profile-logout" data-route="login" role="menuitem">Đăng xuất</button></div></div>';

function alignHeaderUtilities() {
  const notification = document.querySelector('.side-footer button[aria-label="Notifications"]');
  const message = document.querySelector('.side-footer button[aria-label="Messages"]');
  const avatar = document.querySelector('[data-profile-menu-toggle]');
  if (!notification || !message || !avatar) return;
  notification.style.transform = 'none';
  message.style.transform = 'none';
  const bellBox = notification.getBoundingClientRect();
  const messageBox = message.getBoundingClientRect();
  const avatarBox = avatar.getBoundingClientRect();
  if (!bellBox.width || !messageBox.width || !avatarBox.width) return;
  const bellCenter = bellBox.left + bellBox.width / 2;
  const avatarCenter = avatarBox.left + avatarBox.width / 2;
  const messageCenter = messageBox.left + messageBox.width / 2;
  const compactSpan = (avatarCenter - bellCenter) * 2 / 3;
  notification.style.transform = `translateX(${avatarCenter - compactSpan - bellCenter}px)`;
  message.style.transform = `translateX(${avatarCenter - compactSpan / 2 - messageCenter}px)`;
}

requestAnimationFrame(alignHeaderUtilities);
window.addEventListener('resize', alignHeaderUtilities);

function syncLearningSummaryHeight() {
  const mainPanel = document.querySelector('.learning-dashboard .learning-main');
  const summaryPanel = document.querySelector('.learning-dashboard .unfinished-summary');
  if (!mainPanel || !summaryPanel) return;
  summaryPanel.style.setProperty('--learning-main-height', `${Math.round(mainPanel.getBoundingClientRect().height)}px`);
}

window.addEventListener('resize', syncLearningSummaryHeight);

function setupLearningControls() {
  const dashboard = document.querySelector('.learning-dashboard');
  if (!dashboard) return;
  const tools = dashboard.querySelector('.learning-tools');
  const filterBar = dashboard.querySelector('.learning-unfinished');
  if (!tools || !filterBar) return;
  tools.innerHTML = `<button class="learning-notification-toggle" type="button" role="switch" aria-checked="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span><b>Study notifications</b><small>Deadline and progress updates</small></span><i class="notification-switch" aria-hidden="true"></i></button>`;
  filterBar.className = 'course-filter-bar';
  filterBar.innerHTML = `<label class="course-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input aria-label="Search courses" placeholder="Search courses..." /></label><label><span>Category</span><select aria-label="Category"><option>Category</option><option>Core course</option><option>Elective</option></select></label><label><span>Status</span><select aria-label="Status"><option>Status</option><option>In Progress</option><option>Not Started</option></select></label><label><span>Semester</span><select aria-label="Semester"><option>Semester</option><option>Current</option><option>Previous</option></select></label><label><span>Newest</span><select aria-label="Sort courses"><option>Newest</option><option>Progress</option><option>Name</option></select></label>`;
  tools.querySelector('.learning-notification-toggle').addEventListener('click', (event) => {
    const toggle = event.currentTarget;
    const isEnabled = toggle.getAttribute('aria-checked') === 'true';
    toggle.setAttribute('aria-checked', String(!isEnabled));
    toggle.classList.toggle('is-off', isEnabled);
    toggle.querySelector('small').textContent = isEnabled ? 'Notifications paused' : 'Deadline and progress updates';
  });
  const allCourses = [...learningCourses, ['Data Mining', 'MIS306', 64, 'In Progress', 'violet', 'database'], ['Web Development', 'CS303', 51, 'In Progress', 'blue', 'code'], ['Data Visualization', 'BA204', 45, 'In Progress', 'teal', 'chart'], ['Software Engineering', 'CS305', 38, 'Not Started', 'amber', 'system'], ['Human–Computer Interaction', 'MIS307', 26, 'Not Started', 'rose', 'design'], ['Research Methods', 'MIS308', 18, 'Not Started', 'violet', 'database'], ['Digital Business', 'BA206', 12, 'Not Started', 'blue', 'code']];
  const courseGrid = dashboard.querySelector('.learning-course-grid');
  const pagination = dashboard.querySelector('.learning-pagination');
  const tabs = [...dashboard.querySelectorAll('.learning-tabs button')];
  const makeCard = ([name, code, progress, state, tone, icon]) => `<button class="learning-course-card ${tone}" data-route="course-detail"><i class="learning-course-icon">${learningIcon(icon)}</i><span class="learning-course-copy"><b>${name}</b><small>${code} · 3 Credits</small><em><u style="width:${progress}%"></u></em></span><strong>${progress}%</strong><label>${state}</label><i class="learning-more" aria-hidden="true">•••</i><i class="learning-open" aria-hidden="true">→</i></button>`;
  const renderCourses = (mode, page = 1) => {
    const courses = mode === 'all' ? allCourses : learningCourses;
    const pageSize = mode === 'all' ? 6 : courses.length;
    const totalPages = Math.ceil(courses.length / pageSize);
    const activePage = Math.min(Math.max(page, 1), totalPages);
    courseGrid.innerHTML = courses.slice((activePage - 1) * pageSize, activePage * pageSize).map(makeCard).join('');
    tabs.forEach((tab) => tab.classList.toggle('active', (mode === 'all' ? tab.textContent.trim() === 'All Courses' : tab.textContent.trim() === 'Current Semester')));
    pagination.innerHTML = `<button type="button" data-learning-page="${activePage - 1}" ${activePage === 1 ? 'disabled' : ''}>←</button>${Array.from({ length: totalPages }, (_, index) => `<button type="button" class="${index + 1 === activePage ? 'active' : ''}" data-learning-page="${index + 1}">${index + 1}</button>`).join('')}<button type="button" data-learning-page="${activePage + 1}" ${activePage === totalPages ? 'disabled' : ''}>→</button><small>Showing ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, courses.length)} of ${courses.length} courses</small>`;
    pagination.dataset.mode = mode;
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const label = tab.textContent.trim();
    if (label === 'Current Semester') renderCourses('current');
    if (label === 'All Courses') renderCourses('all');
  }));
  pagination.addEventListener('click', (event) => {
    const button = event.target.closest('[data-learning-page]');
    if (!button || button.disabled) return;
    renderCourses(pagination.dataset.mode || 'current', Number(button.dataset.learningPage));
  });
  renderCourses('current');
}

function setupCurriculumControls() {
  const dashboard = document.querySelector('.curriculum-dashboard');
  if (!dashboard) return;
  dashboard.querySelectorAll('.curriculum-semester-toggle').forEach((toggle) => toggle.addEventListener('click', () => {
    const semester = toggle.closest('[data-semester]');
    const isOpen = semester.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  }));
  const search = dashboard.querySelector('.curriculum-search input');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    dashboard.querySelectorAll('[data-semester]').forEach((semester) => {
      const rows = [...semester.querySelectorAll('.curriculum-course-row')];
      const matches = rows.filter((row) => row.dataset.curriculumSearch.includes(query));
      rows.forEach((row) => { row.hidden = Boolean(query) && !matches.includes(row); });
      semester.hidden = Boolean(query) && !matches.length;
      if (query && matches.length) semester.classList.add('is-open');
    });
  });
  dashboard.querySelectorAll('[data-curriculum-filter]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.curriculumFilter !== 'academic') button.classList.toggle('active');
  }));
}
const basePages = new Set(pages.map((page) => page.dataset.page));
const productRoutes = new Set(['dashboard', 'product-home', 'profile', 'settings', 'learning', 'curriculum', 'course-detail', 'textbook', 'library', 'ai-study', 'ai-answer', 'practice', 'skill-gap', 'recommendations', 'next-step']);
let processingTimer;
let nexaAiPosition;

const courseRows = [
  ['Database Systems', 'MIS301', '72%', 'In progress', 'violet'],
  ['Data Structures', 'CS202', '88%', 'In progress', 'cyan'],
  ['Business Analytics', 'BA204', '43%', 'In progress', 'amber'],
  ['System Analysis', 'MIS211', '0%', 'Not started', 'slate'],
  ['UI/UX Design', 'DES106', '100%', 'Completed', 'green'],
];

function courseCard([name, code, progress, status, tone]) {
  return `<button class="course-card" data-route="course-detail"><span class="course-icon ${tone}">▤</span><span class="course-copy"><b>${name}</b><small>${code} · 3 credits</small></span><span class="course-progress"><em>${progress}</em><i><b style="width:${progress}"></b></i><small>${status}</small></span><strong>→</strong></button>`;
}

const views = {
  'product-home': () => `<section class="product-view home-view"><p class="view-kicker">PERSONAL DEVELOPMENT HOME</p><h1>Good morning, Minh <span>👋</span></h1><p class="view-subtitle">Here is your next step.</p><article class="next-step-card"><div><p class="view-kicker">YOUR NEXT STEP</p><h2>Strengthen your SQL skills</h2><p>You’re currently studying Database Systems, but your profile shows limited SQL project experience.</p><button class="btn btn-primary" data-route="next-step">View Roadmap →</button></div><div class="step-visual"><i>SQL</i><span></span><b>↗</b></div></article><div class="home-sections"><section><header><h3>Continue Learning</h3><button data-route="learning">View all →</button></header><div class="mini-course"><span class="course-icon violet">▤</span><div><b>Database Systems</b><small>MIS301 · Chapter 3: Normalization</small><i><em style="width:72%"></em></i></div><strong>72%</strong></div></section><section><header><h3>Your Skills</h3><button data-route="skill-gap">Skill gap →</button></header><div class="skill-chips"><span>SQL <b>70%</b></span><span>Python <b>40%</b></span><span>Power BI <b>35%</b></span></div></section><section><header><h3>AI Recommendations</h3><button data-route="recommendations">See plan →</button></header><p class="recommend-line">Build a <b>Sales Analytics Dashboard</b> to turn your SQL practice into proof.</p></section><section><header><h3>Upcoming Activities</h3><button>Calendar →</button></header><div class="activity"><i>12</i><span><b>Data Systems Study Group</b><small>Tomorrow · 19:00 · Online</small></span></div></section></div></section>`,
  profile: () => `<section class="product-view profile-view"><div class="view-heading"><div><p class="view-kicker">STUDENT DEVELOPMENT PROFILE</p><h1>Minh Anh’s profile</h1><p class="view-subtitle">A complete profile helps NEXA find your strongest next step.</p></div><button class="btn btn-secondary">Edit profile</button></div><article class="profile-hero"><div class="avatar">MA</div><div><h2>Minh Anh</h2><p>Information Technology · Year 3</p><span>Career goal: <b>Data Analyst</b></span></div><div class="completion"><b>78%</b><span>Profile completion</span><i><em></em></i></div></article><div class="profile-grid"><section><h3>About</h3><dl><div><dt>Student ID</dt><dd>IT20230118</dd></div><div><dt>University</dt><dd>NEXA University</dd></div><div><dt>Major</dt><dd>Information Technology</dd></div><div><dt>Academic year</dt><dd>Year 3</dd></div></dl></section><section><h3>Skills</h3><div class="tag-list"><span>SQL</span><span>Python</span><span>Data Analysis</span><span>Figma</span><span>Git</span></div><h3 class="minor-title">Projects & achievements</h3><div class="profile-item"><b>Campus demand dashboard</b><small>Business Analytics · 2026</small></div><div class="profile-item"><b>Top 10 · Data Hackathon</b><small>NEXA University · 2025</small></div></section><aside class="ai-tip"><i>✦</i><div><b>AI suggestion</b><p>Add one data project to strengthen your profile.</p><button data-route="recommendations">See project idea →</button></div></aside></div></section>`,
  learning: () => `<section class="product-view learning-view"><div class="view-heading"><div><p class="view-kicker">MY LEARNING</p><h1>Your learning context</h1><p class="view-subtitle">Courses are signals NEXA uses to shape your next step.</p></div><button class="btn btn-secondary" data-route="curriculum">View curriculum</button></div><nav class="tabs"><button class="active">Current Semester</button><button>All Courses</button><button data-route="curriculum">Curriculum</button><button data-route="library">Library</button><button data-route="practice">Practice</button></nav><div class="course-list">${courseRows.map(courseCard).join('')}</div></section>`,
  curriculum: () => `<section class="product-view curriculum-view curriculum-dashboard"><header class="curriculum-heading"><div><p class="view-kicker">CURRICULUM</p><h1>Your academic curriculum</h1><p class="view-subtitle">Courses are organized by the semesters in your programme — not by a fixed number of terms per year.</p></div></header><section class="curriculum-program-bar"><label><span>Programme</span><select aria-label="Select programme"><option>BSc Information Systems</option></select></label><div class="curriculum-summary"><section><b>35</b><span>Academic<br />courses</span></section><i aria-hidden="true"></i><section><b>105</b><span>Total<br />credits</span></section></div></section><section class="curriculum-controls" aria-label="Curriculum filters"><label class="curriculum-search">⌕<input aria-label="Search curriculum" placeholder="Search course or code..." /></label><div class="curriculum-filter-group"><button class="active" type="button" data-curriculum-filter="academic">Academic only</button><button type="button" data-curriculum-filter="pe">Hide PE</button><button type="button" data-curriculum-filter="soft">Hide soft skills</button><button type="button" data-curriculum-filter="defense">Hide defense</button></div><button class="curriculum-view-mode" type="button">Semester-based <span>⌄</span></button></section><div class="curriculum-filter-note"><i>✓</i><span>Showing academic courses only. Physical education, soft skills and defence education are excluded.</span></div><div class="curriculum-semester-list">${curriculumSemesterMarkup()}</div></section>`,
  'course-detail': () => `<section class="product-view course-detail"><button class="crumb" data-route="learning">← My Learning</button><div class="course-title"><span class="course-icon violet">▤</span><div><p class="view-kicker">MIS301 · 3 CREDITS</p><h1>Database Systems</h1><p class="view-subtitle">Current progress <b>72%</b></p></div><button class="btn btn-primary" data-route="textbook">Open textbook</button></div><nav class="tabs"><button class="active">Overview</button><button>Textbook</button><button>Materials</button><button>AI Tutor</button><button>Practice</button><button>Notes</button><button>Community</button></nav><div class="course-detail-grid"><section><h2>Continue with Chapter 3</h2><p>Normalization and relational design</p><i class="course-progress-bar"><b></b></i><button class="btn btn-secondary" data-route="textbook">Continue reading →</button></section><section><h2>AI Tutor</h2><p>Ask questions with context from Database Systems.</p><button class="outline-link" data-route="ai-study">Explain normalization →</button></section><section><h2>Practice</h2><p>Normalization needs a little more attention.</p><button class="outline-link" data-route="practice">Start practice →</button></section></div></section>`,

  library: () => `
    <section class="product-view library-dashboard">
      <header class="library-heading">
        <div><p class="view-kicker">LEARNING LIBRARY</p><h1>My Library</h1><p>Your learning collection</p></div>
        <label class="library-search"><span>⌕</span><input type="search" aria-label="Search library" placeholder="Search library" /></label>
      </header>
      <nav class="library-type-filters" aria-label="Filter library by type">
        <button class="active" type="button" data-library-filter="all">All</button><button type="button" data-library-filter="textbook">Textbooks</button><button type="button" data-library-filter="material">Materials</button><button type="button" data-library-filter="saved">Saved</button><button type="button" data-library-filter="note">Notes</button>
      </nav>
      <nav class="library-course-filters" aria-label="Filter library by course">
        <button class="active" type="button" data-library-course="all">All courses</button><button type="button" data-library-course="database">Database Systems</button><button type="button" data-library-course="data-structures">Data Structures</button><button type="button" data-library-course="analytics">Business Analytics</button>
      </nav>
      <div class="library-content-grid">
        <section class="library-resource-grid" aria-label="Learning resources">
          <article class="library-resource-card" data-kind="textbook" data-course="database" data-search="database systems concepts design textbook">
            <i class="resource-cover database">DATABASE<br />SYSTEMS<small>Concepts and Design</small></i><div class="resource-copy"><b>Database Systems: Concepts and Design</b><small>CS302 · Textbook</small><span><em style="width:72%"></em></span><strong>72%</strong></div><button data-route="textbook">Continue reading <span>→</span></button>
          </article>
          <article class="library-resource-card" data-kind="textbook" data-course="data-structures" data-search="data structures algorithms python textbook">
            <i class="resource-cover structures">DATA<br />STRUCTURES<small>& Algorithms in Python</small></i><div class="resource-copy"><b>Data Structures & Algorithms in Python</b><small>CS201 · Textbook</small><span><em style="width:48%"></em></span><strong>48%</strong></div><button data-route="textbook">Continue reading <span>→</span></button>
          </article>
          <article class="library-resource-card" data-kind="material" data-course="database" data-search="sql practice sheet set 3 material">
            <i class="resource-cover sheet">SQL<small>PRACTICE SHEET</small><b>▦</b></i><div class="resource-copy"><b>SQL Practice Sheet · Set 3</b><small>CS302 · Material</small><span class="complete"><em style="width:100%"></em></span><strong>100%</strong></div><button data-route="practice">Open material <span>→</span></button>
          </article>
          <article class="library-resource-card" data-kind="saved" data-course="database" data-search="indexing techniques database systems article saved">
            <i class="resource-cover article"><small>ARTICLE</small><b>INDEX</b></i><div class="resource-copy"><b>Indexing Techniques in Database Systems</b><small>CS302 · Saved article</small><span class="resource-saved">✓ Saved</span></div><button type="button">Open article <span>→</span></button>
          </article>
          <article class="library-resource-card" data-kind="material" data-course="database" data-search="normalization dbms slides lecture">
            <i class="resource-cover lecture">Normalization<small>Lecture 8</small></i><div class="resource-copy"><b>Normalization in DBMS</b><small>CS302 · Slide deck</small><span><em style="width:65%"></em></span><strong>65%</strong></div><button data-route="textbook">Open slides <span>→</span></button>
          </article>
          <article class="library-resource-card" data-kind="note" data-course="database" data-search="dbms notes collection">
            <i class="resource-cover notes">DBMS<br />Notes<small>Collection</small></i><div class="resource-copy"><b>DBMS Notes Collection</b><small>CS302 · Notes</small><span class="resource-saved">✓ Saved</span></div><button data-route="textbook">Open notes <span>→</span></button>
          </article>
        </section>
        <aside class="library-notes-panel"><header><h2>▤ &nbsp; Recent notes</h2><button type="button">View all</button></header><button type="button"><i></i><span><b>Query Optimization Techniques</b><small>CS302</small></span></button><button type="button"><i></i><span><b>B+ Tree Indexing Notes</b><small>CS302</small></span></button><button type="button"><i></i><span><b>Normalization Summary</b><small>CS302</small></span></button></aside>
      </div>
      <p class="library-empty" hidden>No resources match the selected filters.</p>
    </section>`,
  'ai-study': () => `<section class="product-view ai-study"><p class="view-kicker">NEXA AI STUDY</p><h1>Hi Minh <span>👋</span></h1><p class="view-subtitle">What would you like to work on?</p><article class="ai-context"><i>✦</i><span>Context active: <b>Database Systems · Chapter 3 · your learning progress</b></span></article><div class="quick-actions"><button data-ai-action="Explain Topic">✦ Explain Topic</button><button data-ai-action="Summarize">≡ Summarize</button><button data-ai-action="Generate Quiz">? Generate Quiz</button><button data-ai-action="Create Flashcards">▣ Create Flashcards</button><button data-ai-action="Create Study Plan">↗ Create Study Plan</button><button data-ai-action="Find Weak Topics">◌ Find Weak Topics</button></div><div class="ai-composer"><input id="ai-question" value="Explain normalization." aria-label="Ask anything about your study" /><button class="btn btn-primary" data-route="ai-answer">Ask AI ↑</button></div></section>`,
  'ai-answer': () => `<section class="product-view ai-answer"><button class="crumb" data-route="ai-study">← AI Study</button><div class="answer-layout"><main><p class="view-kicker">AI STUDY · DATABASE SYSTEMS</p><h1>Normalization, explained for your course</h1><article class="source-badge">Based on: <b>Database Systems</b> · Chapter 3</article><p>Normalization is the process of structuring a database so that each fact is stored once and relationships remain reliable.</p><h2>Why it matters for MIS301</h2><p>In your current chapter, the goal is to reduce duplicate data before you build tables and write SQL queries. Start with a relation, find its key, then separate unrelated facts.</p><div class="answer-note"><b>AI-generated explanation</b><p>This answer combines your course context with NEXA’s learning model. Verify important details with your textbook.</p></div></main><aside><h3>Continue learning</h3><button data-route="textbook">Read Chapter 3 →</button><button data-route="practice">Try a quiz →</button><button data-route="skill-gap">See SQL skill gap →</button></aside></div></section>`,
  practice: () => `<section class="product-view practice-view"><div class="view-heading"><div><p class="view-kicker">PRACTICE</p><h1>Turn learning into confidence</h1><p class="view-subtitle">Practice is personalized from your course, chapter and uploaded materials.</p></div><button class="btn btn-primary">Create practice set</button></div><div class="practice-options"><button><i>?</i><b>Quiz</b><span>Test your understanding</span></button><button><i>▣</i><b>Flashcards</b><span>Review key concepts</span></button><button><i>✎</i><b>Practice questions</b><span>Apply what you learned</span></button></div><section class="weak-topics"><div><p class="view-kicker">LATEST AI INSIGHT</p><h2>Review Normalization</h2><p>Your latest practice shows a clear opportunity to strengthen this topic.</p><button class="outline-link" data-route="ai-study">Ask AI to explain →</button></div><div class="topic-bars"><span>Normalization <b>42%</b><i><em style="width:42%"></em></i></span><span>SQL <b>78%</b><i><em style="width:78%"></em></i></span><span>ERD <b>85%</b><i><em style="width:85%"></em></i></span></div></section></section>`,
  'skill-gap': () => `<section class="product-view skill-gap-view"><p class="view-kicker">SKILL GAP</p><h1>From where you are to Data Analyst</h1><p class="view-subtitle">NEXA compares your current profile with the skills your target career needs.</p><div class="gap-summary"><div><small>CAREER GOAL</small><b>Data Analyst</b></div><div><small>SKILLS ON TRACK</small><b>2 / 5</b></div><div><small>TOP GAP</small><b>Data Visualization</b></div></div><div class="gap-list"><section><header><h2>Current skills</h2><span>Evidence from profile, courses & projects</span></header><div class="skill-row"><b>SQL</b><i><em style="width:70%"></em></i><strong>70%</strong></div><div class="skill-row"><b>Python</b><i><em style="width:40%"></em></i><strong>40%</strong></div><div class="skill-row"><b>Power BI</b><i><em style="width:35%"></em></i><strong>35%</strong></div><div class="skill-row"><b>Data Visualization</b><i><em style="width:30%"></em></i><strong>30%</strong></div></section><aside><h2>Required next</h2><span>For your Data Analyst goal</span><ul><li>SQL</li><li>Python</li><li>Power BI</li><li>Statistics</li><li>Data Visualization</li></ul><button class="btn btn-primary" data-route="recommendations">Get my plan →</button></aside></div></section>`,
  recommendations: () => `<section class="product-view recommendation-view"><p class="view-kicker">PERSONALIZED RECOMMENDATIONS</p><h1>Your focused development plan</h1><p class="view-subtitle">Suggestions are based on your courses, skill gap and Data Analyst goal.</p><div class="recommend-grid"><article><i>▤</i><small>LEARN</small><h2>Advanced SQL</h2><p>Move beyond fundamentals with joins, aggregation and queries from your current course.</p><button data-route="learning">Open learning →</button></article><article><i>◈</i><small>PRACTICE</small><h2>Database exercises</h2><p>Strengthen Normalization before your next practice session.</p><button data-route="practice">Start practice →</button></article><article><i>↗</i><small>BUILD</small><h2>Sales Analytics Dashboard</h2><p>Create one focused data project to add to your profile.</p><button data-route="profile">Add to profile →</button></article><article><i>◎</i><small>JOIN</small><h2>Data Hackathon</h2><p>Apply your skills in a real team setting this semester.</p><button>View opportunity →</button></article></div></section>`,
  'next-step': () => `<section class="product-view roadmap-view"><p class="view-kicker">NEXT STEP ENGINE</p><h1>Complete SQL Fundamentals</h1><p class="view-subtitle">One focused step, based on your actual situation.</p><article class="roadmap-reason"><i>✦</i><div><b>Why this is your next step</b><p>You are currently learning Database Systems and SQL is required for your target career. Completing this step makes your profile more credible for analytics opportunities.</p></div></article><div class="roadmap-steps"><section><i>1</i><div><b>Learn</b><span>Finish SQL fundamentals in Database Systems</span></div><em>Current</em></section><section><i>2</i><div><b>Practice</b><span>Complete 10 database exercises</span></div></section><section><i>3</i><div><b>Build</b><span>Create a compact SQL analytics project</span></div></section></div><div class="roadmap-action"><button class="btn btn-secondary" data-route="learning">View course</button><button class="btn btn-primary" data-route="textbook">Start now →</button></div></section>`,
};

views.settings = () => `<section class="product-view profile-view"><div class="view-heading"><div><p class="view-kicker">ACCOUNT SETTINGS</p><h1>Cài đặt tài khoản</h1><p class="view-subtitle">Quản lý thông tin, thông báo và trải nghiệm học tập của bạn.</p></div></div><div class="profile-grid"><section><h3>Thông báo</h3><div class="profile-item"><b>Nhắc nhở kế hoạch học tập</b><small>Nhận thông báo về các việc cần hoàn thành hôm nay.</small></div><div class="profile-item"><b>Hạn nộp sắp tới</b><small>Nhắc trước hạn nộp bài và quiz.</small></div></section><section><h3>Quyền riêng tư</h3><div class="profile-item"><b>Hiển thị tiến độ học tập</b><small>Chia sẻ tiến độ với bạn học trong cộng đồng.</small></div><div class="profile-item"><b>Hỗ trợ từ NEXA AI</b><small>Cho phép AI dùng tiến độ học tập để đưa ra gợi ý phù hợp.</small></div></section></div></section>`;

['community', 'opportunities', 'career', 'study-group'].forEach((route) => productRoutes.add(route));

Object.assign(views, {
  'product-home': () => `<section class="product-view home-view ref-home"><header class="ref-greeting"><h1>Good morning, Minh Anh <span>👋</span></h1><p>What will you accomplish today?</p></header><div class="home-dashboard-top"><section class="dashboard-panel home-progress"><header><h2><i>⌁</i> TODAY'S PROGRESS</h2><span class="live-status">● Live</span></header><div class="progress-metrics"><article><i class="metric-icon book">▤</i><b>2</b><span>Topics Learned</span><small>↑ 33% vs yesterday</small></article><article><i class="metric-icon clock">◔</i><b>95 <em>min</em></b><span>Study Time</span><small>↑ 15% vs yesterday</small></article><article><i class="metric-icon target">◎</i><b>3/5</b><span>Tasks Completed</span><small>↑ 20% vs yesterday</small></article><article><i class="metric-icon fire">♨</i><b>7</b><span>Day Streak</span><small>Keep it up! 🔥</small></article></div><div class="xp-progress"><i>Lv.<b>12</b></i><div><span>XP Progress</span><small>6,240 / 8,000 XP</small><p><b></b></p></div><strong>78%<small>to next level</small></strong></div></section><section class="dashboard-panel home-plan"><header><h2><i>◎</i> TODAY'S PLAN</h2><span>2 / 3 done <b><em></em></b></span></header><button data-route="learning"><i>▣</i><span>Review Normalization <small>Learning</small></span><em>30 min</em></button><button data-route="practice"><i>◇</i><span>Practice SQL Joins <small>Practice</small></span><em>45 min</em></button><button data-route="textbook"><i>▤</i><span>Read Chapter 4 <small>Database Systems</small></span><em>20 min</em></button><a data-route="learning">View full plan　→</a></section><section class="dashboard-panel home-calendar"><header><h2><i>▦</i> CALENDAR</h2><span>This month　⌄　‹　›</span></header><h3>May 2025</h3><div class="home-calendar-grid"><b>Su</b><b>Mo</b><b>Tu</b><b>We</b><b>Th</b><b>Fr</b><b>Sa</b><span class="dim">27</span><span class="dim">28</span><span class="dim">29</span><span class="dim">30</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span class="today">15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span></div></section></div><div class="home-dashboard-bottom"><section class="dashboard-panel home-continue"><header><h2><i>▤</i> CONTINUE LEARNING</h2><span>Overall Progress　<em>64%</em><b><i></i></b></span></header><div class="reference-course-grid">${courseRows.slice(0,4).map(([name, code, progress, status, tone], index) => `<button data-route="course-detail"><i class="reference-course-icon ${tone}">${['⌁','♧','▥','◉'][index]}</i><b>${name}</b><small>${code}</small><span><em style="width:${progress}"></em></span><strong>${progress}</strong></button>`).join('')}</div></section><aside class="dashboard-panel home-deadlines"><header><h2><i>◔</i> UPCOMING DEADLINES</h2><span class="spark">✦</span></header><button><i class="deadline-icon red">♟</i><span><b>Quiz – Chapter 3</b><small>Database Systems</small></span><em>May 15, 2025<small>Due Today</small></em></button><button><i class="deadline-icon orange">♙</i><span><b>Assignment 2</b><small>Data Structures</small></span><em>May 18, 2025<small>in 3 days</small></em></button><button><i class="deadline-icon blue">▱</i><span><b>Project Proposal</b><small>Business Analytics</small></span><em>May 25, 2025<small>in 10 days</small></em></button><a data-route="learning">View all deadlines　→</a></aside></div></section>`,
  learning: () => `<section class="product-view learning-view"><div class="workspace-heading"><h1>My Courses</h1></div><nav class="tabs"><button class="active">Current Semester</button><button>All Courses</button><button>Completed</button></nav><div class="learning-split"><div class="course-list">${courseRows.slice(0,4).map(([name, code, progress, status, tone]) => `<button class="wide-course" data-route="course-detail"><i class="course-icon ${tone}">▤</i><span><b>${name}</b><small>${code} · 3 Credits</small><em><u style="width:${progress}"></u></em></span><strong>${progress}</strong><label>Next: ${name === 'Database Systems' ? 'Normalization' : name === 'Data Structures' ? 'Linked List' : name === 'Business Analytics' ? 'Descriptive Statistics' : 'Requirements Elicitation'}</label><a>Continue →</a></button>`).join('')}</div><aside class="calendar-board"><h3>Calendar</h3><b>May 2025</b><div class="mini-calendar" aria-label="May 2025 calendar"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span><span>09</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span class="selected-date">15</span><span>16</span><span>17</span></div><h4>Upcoming Deadlines</h4><p><span class="deadline-mark">▣</span>Quiz – Chapter 3 <em>May 15, 2025</em></p><p><span class="deadline-mark">▧</span>Assignment 2 <em>May 18, 2025</em></p><p><span class="deadline-mark">▤</span>Project Proposal <em>May 25, 2025</em></p><a>View all deadlines →</a></aside></div></section>`,
  'ai-study': () => `<section class="product-view ai-study"><div class="ai-workspace"><main><h1>Chat with NEXA</h1><p>Your study companion</p><div class="ai-welcome"><i>✦</i><div><b>Hi Minh Anh! 👋</b><span>What would you like to learn today?</span></div><button>×</button></div><div class="ai-action-grid"><button data-ai-action="Explain"><b>Explain</b><span>Normalization in database systems</span></button><button data-ai-action="Summarize"><b>Summarize</b><span>This chapter</span></button><button data-ai-action="Generate"><b>Generate</b><span>10 quiz questions</span></button><button data-ai-action="Create"><b>Create</b><span>Flashcards</span></button></div><div class="ai-composer"><input id="ai-question" placeholder="Ask anything about your study..." aria-label="Ask anything about your study" /><button class="btn btn-primary" data-route="ai-answer">↗</button></div></main><aside class="recent-chats"><h3>Recent Chats</h3>${['What is 2NF and 3NF?','Explain SQL JOINs','Difference between DELETE and TRUNCATE','Explain ACID properties','What is index in DB?'].map((item,index) => `<button data-route="ai-answer">${item}<small>${index < 2 ? 'Today' : index < 4 ? 'Yesterday' : '2 days ago'}</small></button>`).join('')}<a>View all chats →</a></aside></div></section>`,
  community: () => `<section class="product-view community-view"><div class="community-split"><main><div class="post-composer"><input placeholder="What’s on your mind?" /><button>Post</button></div><nav class="tabs"><button class="active">For you</button><button>Following</button><button>Popular</button></nav>${[['Nguyễn Hoàng Nam','Can someone explain why we need Normalization in databases?','I’m still confused about 2NF and 3NF.'],['Trần Minh Khoa','My way to remember SQL JOINs','I created a simple diagram for the different types of JOIN.']].map(([name,title,body],index) => `<article class="community-post"><header><i>${index ? 'MK' : 'NH'}</i><span><b>${name}</b><small>${index ? '4 hours ago' : '2 hours ago'}</small></span><em>${index ? 'Study Tip' : 'Question'}</em></header><h2>${title}</h2><p>${body}</p><footer>♥ ${index ? '24' : '12'} &nbsp; ◌ ${index ? '6' : '8'} <a>View answers →</a></footer></article>`).join('')}</main><aside class="trend-board"><h3>Trending Topics</h3>${['SQL Performance','Python for Data Analysis','Power BI Dashboard','Database Normalization','Career in Data'].map((topic,index) => `<p><b>${topic}</b><small>${[24,19,16,35,16][index]} posts</small></p>`).join('')}<a>View all topics →</a></aside></div></section>`,
  'study-group': () => `<section class="product-view study-group-view"><div class="study-group-split"><main><header class="group-head"><i class="course-icon violet">▤</i><div><h1>Database Systems Study Group</h1><p>12 members · Active now</p></div><button>⋯</button></header><nav class="tabs"><button class="active">Chat</button><button>Files</button><button>Tasks</button><button>Events</button></nav><div class="chat-thread"><article><i>MA</i><div><header><b>Minh Anh</b><small>9:30 AM</small></header><p>Hey everyone! I’ve finished a summary for Chapter 3. Let me know if you see anything missing.</p><button class="file-chip">▧ Chapter 3 Summary.pdf <small>2.4 MB</small></button><footer>👍 4　💡 2　◌ 1</footer></div></article><article><i>HN</i><div><header><b>Hoàng Nam</b><small>9:45 AM</small></header><p>Great summary! Can someone explain a question about 2NF?</p></div></article><article><i>LP</i><div><header><b>Lan Phương</b><small>10:04 AM</small></header><p>I added some practice questions for everyone.</p><button class="file-chip">▧ Normalization Quiz.pdf <small>1.6 MB</small></button></div></article></div><div class="group-composer"><input placeholder="Type a message..." /><button>⌁</button><button>☺</button><button class="send">↗</button></div></main><aside class="members-board"><header><h3>Members (12)</h3><button>Close</button></header>${[['Minh Anh','You · Admin'],['Phương Nam','Online'],['Lan Phương','Online'],['Đức Anh','Online'],['Thu Hà','Offline']].map(([name,status],index) => `<div><i>${index === 0 ? 'MA' : name.split(' ').map(x=>x[0]).join('').slice(0,2)}</i><span><b>${name}</b><small>${status}</small></span></div>`).join('')}<a>View all members →</a></aside></div></section>`,
  opportunities: () => `<section class="product-view opportunity-view"><div class="opportunity-split"><main><h1>All Opportunities</h1><div class="opportunity-search">⌕ <input placeholder="Search opportunities" /></div><nav class="tabs"><button class="active">All</button><button>Recommended</button><button>Saved</button></nav>${[['Data Hackathon 2025','Hackathon · Online','85% Match','Deadline: May 30, 2025'],['Google Student Program','Program · Online','81% Match','Deadline: Jun 15, 2025'],['SQL Workshop','Workshop · Offline','78% Match','Deadline: Jun 28, 2025'],['Analytics Vietnam Contest','Competition · Online','75% Match','Deadline: Jun 25, 2025']].map(([title,type,match,deadline]) => `<button class="opportunity-row"><i>▣</i><span><b>${title}</b><small>${type}</small></span><em>${match}</em><label>${deadline}</label><strong>♧</strong></button>`).join('')}</main><aside class="matches-board"><div class="match-ring"><b>78%</b></div><h3>Your Matches</h3><p>Great! You have high match opportunities.</p><button class="btn btn-primary">View skill gap</button><h4>Saved (3)</h4><span>▣ Data Hackathon 2025</span><span>▤ Google Student Program</span><span>▧ SQL Workshop</span></aside></div></section>`,
  career: () => `<section class="product-view career-view"><div class="career-split"><main><h1>Your Career Path</h1><p>Data Analyst</p><button class="change-goal">Change Goal</button><div class="career-path"><section class="done"><i>✓</i><b>Learn</b><span>Complete SQL and skill basics</span></section><section class="done"><i>✓</i><b>Skill</b><span>Develop core technical skills</span></section><section class="current"><i>▣</i><b>Project</b><span>Build a real-world project</span></section><section><i>♧</i><b>Opportunity</b><span>Find internships & experiences</span></section><section><i>◎</i><b>Career</b><span>Land your first job</span></section></div><article class="career-next"><div><p class="view-kicker">NEXT STEP FOR YOU</p><h2>Build your first SQL project</h2><p>Apply your SQL skills by building a real project. This will strengthen your portfolio.</p><button class="btn btn-primary" data-route="recommendations">View Project Ideas →</button></div><i>▦</i></article></main><aside class="career-insights"><h3>Career Insights</h3><p>Top Skills for Data Analyst</p>${[['SQL','82%'],['Python','62%'],['Power BI','55%'],['Statistics','48%'],['Excel','44%']].map(([name,value]) => `<span>${name}<i><em style="width:${value}"></em></i></span>`).join('')}<h4>Recommended for you</h4><button>▣ Complete Power BI Course</button><button>▤ Practice Python (Pandas)</button></aside></div></section>`,
  textbook: () => `
    <section class="product-view reader-workspace">
      <header class="reader-appbar">
        <button class="reader-back" data-route="library">← <span>Back to Library</span></button>
        <strong>▧ &nbsp; Database Systems — Fundamentals of Database Design</strong>
        <nav aria-label="Reader tools"><button title="Search">⌕<small>Search</small></button><button title="Bookmark">♧<small>Bookmark</small></button><button title="Highlight">✦<small>Highlight</small></button><button title="Notes">▤<small>Notes</small></button><button title="More">•••<small>More</small></button></nav>
      </header>
      <div class="reader-stage">
        <aside class="reader-contents">
          <header><b>Table of Contents</b><button type="button" aria-label="Collapse contents">‹</button></header>
          <div class="reader-chapters">
            <button type="button">3.1 <span>Functional Dependency</span></button>
            <button type="button">3.2 <span>Normal Forms</span><em>⌄</em></button>
            <button type="button"><small>3.2.1</small><span>First Normal Form (1NF)</span></button>
            <button class="active" type="button"><small>3.2.2</small><span>Second Normal Form (2NF)</span></button>
            <button type="button"><small>3.2.3</small><span>Third Normal Form (3NF)</span></button>
            <button type="button"><small>3.2.4</small><span>Boyce-Codd Normal Form (BCNF)</span></button>
            <button type="button">3.3 <span>Decomposition</span></button>
            <button type="button">3.4 <span>Summary</span></button>
          </div>
        </aside>
        <main class="reader-book-frame" aria-label="Textbook pages">
          <div class="reader-book">
            <article class="reader-page">
              <header><span>Chapter 3 · Normalization</span><b>68</b></header>
              <h1>3.2.2 &nbsp; Second Normal Form (2NF)</h1>
              <p><b>Second Normal Form (2NF)</b> is a rule used in database normalization to eliminate partial dependencies. A relation is in 2NF if it is in 1NF and every non-key attribute is fully dependent on the whole primary key.</p>
              <ul><li>Every non-key attribute is fully functionally dependent on the primary key.</li><li>No attribute depends on only part of a composite primary key.</li></ul>
              <p>In other words, no non-key attribute should depend on only a part of a composite key. This ensures that data is stored efficiently and redundancy is minimized.</p>
              <h2>Example</h2>
              <p>Consider a relation <b>ENROLLMENT</b> with a composite primary key <i>(StudentID, CourseID)</i>.</p>
              <table><thead><tr><th>StudentID</th><th>StudentName</th><th>CourseID</th><th>CourseName</th><th>Instructor</th></tr></thead><tbody><tr><td>S001</td><td>Anna</td><td>C101</td><td>Database Systems</td><td>Dr. Minh</td></tr><tr><td>S001</td><td>Anna</td><td>C102</td><td>Data Structures</td><td>Dr. Lan</td></tr><tr><td>S002</td><td>Binh</td><td>C101</td><td>Database Systems</td><td>Dr. Minh</td></tr></tbody></table>
              <aside><b>⊙</b><span>In this relation, StudentName depends only on StudentID, and CourseName depends only on CourseID. These are partial dependencies, so the relation is not in 2NF.</span></aside>
            </article>
            <article class="reader-page">
              <header><span>Chapter 3 · Normalization</span><b>69</b></header>
              <h2>How to Achieve 2NF</h2>
              <p>To convert a relation to 2NF:</p>
              <ol><li>Ensure the relation is in 1NF.</li><li>Identify partial dependencies.</li><li>Decompose the relation into smaller relations so that every non-key attribute depends on the whole primary key.</li></ol>
              <p>Applying this to the ENROLLMENT relation:</p>
              <h3>STUDENT <small>(StudentID, StudentName)</small></h3>
              <table><thead><tr><th>StudentID</th><th>StudentName</th></tr></thead><tbody><tr><td>S001</td><td>Anna</td></tr><tr><td>S002</td><td>Binh</td></tr></tbody></table>
              <h3>ENROLLMENT <small>(StudentID, CourseID)</small></h3>
              <table><thead><tr><th>StudentID</th><th>CourseID</th></tr></thead><tbody><tr><td>S001</td><td>C101</td></tr><tr><td>S001</td><td>C102</td></tr><tr><td>S002</td><td>C101</td></tr></tbody></table>
              <aside><b>✦</b><span><strong>Key Takeaway</strong><br />A relation is in Second Normal Form when it is in 1NF and all non-key attributes are fully functionally dependent on the entire candidate key.</span></aside>
            </article>
          </div>
        </main>
      </div>
      <footer class="reader-bottom-bar">
        <button type="button">← &nbsp; Previous</button>
        <b>68 / 312</b>
        <button type="button">Next &nbsp; →</button>
        <span><button type="button" title="Reader view">▧</button><button class="active" type="button" title="Book view">▥</button><button type="button" title="Grid view">▦</button></span>
        <button type="button" title="Full screen">⛶</button>
      </footer>
    </section>`,
});

const learningIcon = (type) => {
  const icons = {
    database: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10h4v10M10 20V5h4v15M16 20v-7h4v7M3 20h18"/><path d="m5 8 5-4 4 3 6-5"/></svg>',
    system: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 13l3-3 2 2 4-4"/></svg>',
    design: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7 7 4 9M17 7l-4 9M7 6h10"/></svg>'
  };
  return icons[type];
};

const learningCourses = [
  ['Database Systems', 'MIS301', 72, 'In Progress', 'violet', 'database'],
  ['Data Structures', 'MIS302', 58, 'In Progress', 'blue', 'code'],
  ['Business Analytics', 'MIS303', 46, 'In Progress', 'teal', 'chart'],
  ['System Analysis', 'MIS304', 33, 'Not Started', 'amber', 'system'],
  ['UI/UX Design', 'MIS305', 20, 'Not Started', 'rose', 'design']
];

const curriculumSemesters = [
  ['Semester 1','HK03/2024','Completed',true,[['010069','Cơ sở lập trình',3,'—','Completed'],['011741','Toán kinh tế',3,'—','Completed'],['011742','Năng lực số',3,'—','Completed'],['011817','Kinh tế học vi mô',3,'—','Completed']]],
  ['Semester 2','HK01/2025','In progress',true,[['010038','Nguyên lý kế toán',3,'—','In progress'],['010043','Toán rời rạc',3,'010069','In progress'],['010070','Cấu trúc dữ liệu và giải thuật',3,'010069','In progress'],['011818','Kinh tế học vi mô',3,'011817','Completed']]],
  ['Semester 3','HK02/2025','Not started',false,[['010081','Thuế',3,'—','Not started'],['010637','Pháp luật đại cương',3,'—','Not started'],['011134','Triết học Mác – Lênin',3,'—','Not started']]],
  ['Semester 4','HK03/2025','Not started',false,[['010033','Quản trị học',3,'—','Not started'],['010630','Nguyên lý Marketing',3,'—','Not started'],['011745','Phát triển bền vững',3,'011817, 011818','Not started']]],
  ['Semester 5','HK01/2026','Not started',false,[['010035','Tài chính – Tiền tệ',3,'—','Not started'],['011136','Chủ nghĩa xã hội khoa học',2,'011134','Not started'],['011708','Hệ thống thông tin quản lý',3,'—','Not started']]],
  ['Semester 6','HK02/2026','Not started',false,[['010016','Tư tưởng Hồ Chí Minh',2,'011134, 011135, 011136','Not started'],['010163','Tài chính doanh nghiệp',3,'010035','Not started'],['011643','Phân tích và thiết kế hệ thống thông tin',3,'011707, 011708','Not started']]],
  ['Semester 7','HK03/2026','Not started',false,[['011137','Lịch sử Đảng Cộng sản Việt Nam',2,'011134, 011135, 011136','Not started'],['011718','Thương mại điện tử',3,'—','Not started'],['011746','Trí tuệ nhân tạo trong kinh doanh',3,'011866','Not started']]],
  ['Semester 8','HK01/2027','Not started',false,[['010580','Hệ thống hoạch định nguồn lực doanh nghiệp',3,'011708','Not started'],['010648','An toàn thông tin',3,'011707, 011765','Not started'],['010688','Hệ quản trị cơ sở dữ liệu SQL Server',3,'011707','Not started']]],
  ['Semester 9','HK02/2027','Not started',false,[['011649','Quản trị dự án công nghệ thông tin',3,'011708','Not started'],['011650','Kiểm thử phần mềm',3,'010688','Not started']]],
  ['Semester 10','HK03/2027','Not started',false,[['011704','Khóa luận tốt nghiệp (Hệ thống thông tin quản lý)',6,'—','Not started'],['011705','Thực tập cuối khóa',3,'—','Not started'],['011871','Chuyển đổi số',3,'—','Not started']]]
];

function curriculumSemesterMarkup() {
  const stateClass = (state) => state.toLowerCase().replaceAll(' ', '-');
  return curriculumSemesters.map(([label, term, state, open, courses]) => `<section class="curriculum-semester ${open ? 'is-open' : ''}" data-semester><button class="curriculum-semester-toggle" type="button" aria-expanded="${open}"><i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></i><span><b>${label}</b><small>(${term})</small></span><em>${courses.length} courses&nbsp; • &nbsp;${courses.reduce((sum, course) => sum + course[2], 0)} credits</em><strong class="curriculum-status ${stateClass(state)}">${state}</strong></button><div class="curriculum-course-table"><header><span>Code</span><span>Course name</span><span>Prerequisite</span><span>Status</span></header><div>${courses.map(([code,title,credits,prerequisite,courseState]) => `<button type="button" class="curriculum-course-row" data-route="course-detail" data-curriculum-search="${`${code} ${title}`.toLowerCase()}"><i>▤</i><span class="curriculum-code">${code}</span><span class="curriculum-course-name"><b>${title}</b><small>${credits} credits</small></span><span class="curriculum-prerequisite">${prerequisite}</span><em class="curriculum-status ${stateClass(courseState)}">${courseState}</em></button>`).join('')}</div></div></section>`).join('');
}

const learningMenuIcon = (type) => ({
  cap: '<svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5-9 5Z"/><path d="M6 11v5c3 3 9 3 12 0v-5M21 10v5"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 5h7a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4Z"/><path d="M20 5h-7a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h7Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6Z"/><path d="m19 16 .5 2L22 19l-2.5.6L19 22l-.5-2.4L16 19l2.5-1Z"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m16 8 5-5M18 3h3v3"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M8 15c-2-1.5-3-3.5-3-6a7 7 0 1 1 14 0c0 2.5-1 4.5-3 6Z"/></svg>',
  compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg>',
  library: '<svg viewBox="0 0 24 24"><path d="M4 4h5v16H4zM10 4h5v16h-5zM16 4h4v16h-4z"/><path d="M6 8h1M12 8h1M18 8h1"/></svg>',
  pen: '<svg viewBox="0 0 24 24"><path d="m4 20 4.5-1 10-10a2.4 2.4 0 0 0-3.5-3.5l-10 10Z"/><path d="m13.5 6.5 4 4M4 20l4-4"/></svg>'
})[type];

views.learning = () => {
  const cards = learningCourses.map(([name, code, progress, state, tone, icon]) => `<button class="learning-course-card ${tone}" data-route="course-detail"><i class="learning-course-icon">${learningIcon(icon)}</i><span class="learning-course-copy"><b>${name}</b><small>${code} · 3 Credits</small><em><u style="width:${progress}%"></u></em></span><strong>${progress}%</strong><label>${state}</label><i class="learning-more" aria-hidden="true">•••</i><i class="learning-open" aria-hidden="true">→</i></button>`).join('');
  const unfinishedCourses = [
    ['Database Design', 'MIS201'], ['Statistics Basics', 'STA101'],
    ['UX Research', 'DES102'], ['Python Foundations', 'CS101'],
    ['SQL Practice', 'MIS202'], ['Data Visualization', 'BA203'],
    ['Systems Thinking', 'MIS205'], ['Business Communication', 'BUS110']
  ];
  const deadlines = [['15','Quiz – Chapter 3','Database Systems','In 3 days','pink'],['18','Assignment 2','Data Structures','In 6 days','orange'],['25','Project Proposal','Business Analytics','In 13 days','blue'],['27','UI/UX Case Study','UI/UX Design','In 15 days','purple']];
  return `<section class="product-view learning-view learning-dashboard"><div class="learning-content"><main class="learning-main"><header class="learning-heading"><div><h1>My Learning <span>✦</span></h1><p>Track your courses, progress and keep learning.</p></div><div class="learning-tools"><label><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input aria-label="Search courses" placeholder="Search courses..." /></label><button type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7Z"/></svg>Filter</button></div></header><nav class="learning-tabs" aria-label="Learning sections"><button class="active">Current Semester</button><button>All Courses</button><button data-route="curriculum">Curriculum</button></nav><div class="learning-unfinished"><i>i</i><span>You have unfinished courses from previous semesters.<small>Keep going! You’re closer than you think.</small></span><button type="button">View Unfinished Courses</button></div><div class="learning-course-grid">${cards}</div><footer class="learning-pagination"><span>←</span><b>1</b><span>2</span><span>→</span><small>Showing 1–5 of 5 courses</small></footer></main><aside class="learning-aside"><section class="streak-card"><header><i class="streak-flame" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M13 2c.5 3-1 5-2.8 6.8C8.7 10.2 8 12.1 8 14a4 4 0 0 0 8 0c0-1.7-.7-3.2-2-4.5 2.1.6 4 2.7 4 5.5a6 6 0 0 1-12 0c0-3.4 1.6-5.7 4.5-8.6C11.6 5.3 12.5 3.8 13 2Z"/></svg></i><span><b>7</b>Day Streak</span></header><div class="streak-week">${['M','T','W','T','F','S','S'].map((day,index) => `<span class="${index === 5 ? 'rest' : ''}"><b></b>${day}</span>`).join('')}</div></section><section class="learning-deadlines"><header><h2>Upcoming Deadline</h2><button type="button">View all</button></header>${deadlines.map(([day,title,course,when,tone]) => `<article><i class="deadline-date ${tone}"><small>MAY</small><b>${day}</b></i><span><b>${title}</b><small>${course}</small></span><em class="${tone}">${when}</em></article>`).join('')}</section><section class="unfinished-summary"><header><h2>Unfinished Courses</h2><button type="button">View all</button></header><div class="unfinished-summary-overview"><i>!</i><span><b>8 <small>courses</small></b><em>from previous semesters</em></span><button type="button" aria-label="View unfinished courses">→</button></div><ul class="unfinished-course-list">${unfinishedCourses.map(([title, code]) => `<li><i>◌</i><span><b>${title}</b><small>${code}</small></span><button type="button" data-route="course-detail">Tiếp tục</button></li>`).join('')}</ul></section></aside></div></section>`;
};

const primaryNav = [['product-home','Home'],['learning','Learning'],['community','Community'],['opportunities','Opportunities'],['career','Career']];
const sectionMenus = {
  learning: [['learning','My Learning',learningMenuIcon('cap')],['curriculum','Curriculum',learningMenuIcon('book')],['library','Library',learningMenuIcon('library')],['ai-study','AI Study',learningMenuIcon('spark')],['skill-gap','Skill Gap',learningMenuIcon('target')],['recommendations','Recommendations',learningMenuIcon('bulb')],['next-step','Next Step',learningMenuIcon('compass')],['practice','Practice',learningMenuIcon('pen')]],
  'ai-study': [['ai-study','Chat with NEXA','✦'],['ai-study','Explain','◌'],['ai-study','Summarize','≋'],['practice','Generate Quiz','◇'],['practice','Flashcards','▣'],['ai-answer','Weak Topics','◔'],['next-step','Study Plan','▧']],
  community: [['community','Feed','▦'],['community','Q&A','?'],['study-group','Study Groups','◉'],['community','Discussions','◌'],['community','Events','◇']],
  opportunities: [['opportunities','All Opportunities','▣'],['opportunities','Internships','◈'],['opportunities','Competitions','◇'],['opportunities','Scholarships','♢'],['opportunities','Programs','▤'],['opportunities','Workshops','▧']],
  career: [['career','Career Path','◉'],['skill-gap','Skill Gap','⌁'],['profile','CV Builder','▤'],['profile','Portfolio','◈'],['opportunities','Job Board','▣'],['next-step','Interview Prep','◎']]
};

function renderProduct(route) {
  const view = route === 'dashboard' ? 'product-home' : route;
  const section = ['curriculum','library','practice','course-detail','textbook','ai-study','ai-answer','skill-gap','recommendations','next-step'].includes(view) ? 'learning' : view === 'study-group' ? 'community' : view;
  const nav = document.querySelector('.product-sidebar nav');
  const navIcons = {
    'product-home': '<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-6h6v6"/></svg>',
    learning: '<svg viewBox="0 0 24 24"><path d="M4 5h16v15H4Z"/><path d="M8 5v15M11 10h6M11 14h6"/></svg>',
    'ai-study': '<svg viewBox="0 0 24 24"><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6Z"/></svg>',
    community: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3 20c.5-4 3-6 6-6s5.5 2 6 6M15 15c3 0 5 2 5 5"/></svg>',
    opportunities: '<svg viewBox="0 0 24 24"><path d="M5 7h14v13H5Z"/><path d="M9 7V5h6v2M5 12h14M10 12v2h4v-2"/></svg>',
    career: '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5Z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>'
  };
  nav.innerHTML = primaryNav.map(([name,label]) => `<button data-route="${name}" class="${name === section || (section === 'product-home' && name === 'product-home') ? 'active' : ''}"><i class="global-nav-icon" aria-hidden="true">${navIcons[name]}</i><span>${label}</span></button>`).join('');
  const menu = sectionMenus[section];
  const content = (views[view]?.() || views['product-home']()).replaceAll('Minh Anh', 'Vân Anh');
  const learningLevel = section === 'learning' ? '<section class="learning-sidebar-level"><i><small>Lv.</small><b>12</b></i><strong>1,250 / 2,000 XP</strong><span><b></b></span><small>Learning Level</small></section>' : '';
  const isReader = view === 'textbook';
  document.querySelector('#product-view').innerHTML = menu ? `<div class="module-layout ${section === 'learning' ? 'learning-section' : ''}${isReader ? ' reader-layout' : ''}">${isReader ? content : `<aside class="module-sidebar">${learningLevel}<p>${section === 'ai-study' ? 'AI STUDY' : section.toUpperCase()}</p>${menu.map(([name,label,icon],index) => `<button data-route="${name}" class="${(name === view || (!index && section === view)) ? 'active' : ''}"><span class="module-menu-icon">${icon}</span><span>${label}</span></button>`).join('')}</aside>${content}`}</div>` : content;
  if (view === 'learning') { setupLearningControls(); requestAnimationFrame(syncLearningSummaryHeight); }
  if (view === 'curriculum') setupCurriculumControls();
  if (view === 'library') setupLibraryControls();
  if (view === 'product-home') setupNexaAiOrb();
}


function setupLibraryControls() {
  const host = document.querySelector('.library-dashboard');
  if (!host) return;

  const typeFilters = host.querySelectorAll('[data-library-filter]');
  const courseFilters = host.querySelectorAll('[data-library-course]');
  const search = host.querySelector('.library-search input');
  const cards = host.querySelectorAll('.library-resource-card');
  const empty = host.querySelector('.library-empty');
  let type = 'all';
  let course = 'all';

  const update = () => {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const matchesType = type === 'all' || card.dataset.kind === type;
      const matchesCourse = course === 'all' || card.dataset.course === course;
      const matchesSearch = !query || card.dataset.search.includes(query);
      const visible = matchesType && matchesCourse && matchesSearch;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    empty.hidden = shown !== 0;
  };

  typeFilters.forEach((button) => button.addEventListener('click', () => {
    type = button.dataset.libraryFilter;
    typeFilters.forEach((item) => item.classList.toggle('active', item === button));
    update();
  }));
  courseFilters.forEach((button) => button.addEventListener('click', () => {
    course = button.dataset.libraryCourse;
    courseFilters.forEach((item) => item.classList.toggle('active', item === button));
    update();
  }));
  search.addEventListener('input', update);
}
function setupNexaAiOrb() {
  const host = document.querySelector('.ref-home');
  if (!host) return;
  host.querySelectorAll('.progress-metrics small').forEach((note) => {
    const [trend, ...copy] = note.textContent.trim().split(' ');
    if (trend === '↑' || trend === '↓') {
      const [value, ...label] = copy;
      note.innerHTML = `<b>${trend}</b><em>${value}</em> ${label.join(' ')}`;
    } else {
      note.textContent = note.textContent.trim();
    }
  });
  const courseIcons = ['assets/images/icon-book-ring.png', 'assets/images/icon-target.png', 'assets/images/icon-progress.png', 'assets/images/icon-book.png'];
  const courseIconVersion = 'home-icons-20260902';
  host.querySelectorAll('.reference-course-icon').forEach((icon, index) => {
    icon.innerHTML = `<img src="${courseIcons[index]}?v=${courseIconVersion}" alt="" />`;
  });
  const levelBadge = host.querySelector('.xp-progress > i');
  if (levelBadge) {
    const level = Math.max(1, Number(levelBadge.dataset.level || levelBadge.querySelector('b')?.textContent || 12));
    levelBadge.dataset.level = String(level);
    levelBadge.innerHTML = `<b>${level}</b>`;
  }
  const calendarControls = host.querySelector('.home-calendar header > span');
  calendarControls?.remove();
  host.querySelector('#nexa-ai-orb, #nexa-ai-chat')?.remove();
  host.insertAdjacentHTML('afterbegin', `<button id="nexa-ai-orb" class="nexa-ai-orb" aria-label="Open NEXA AI technical support">✦</button><aside id="nexa-ai-chat" class="nexa-ai-chat" aria-hidden="true"><header><span><b>NEXA AI</b><small>Technical support</small></span><button type="button" data-ai-close aria-label="Close AI chat">×</button></header><div class="nexa-ai-messages"><p class="ai-message">Hi Vân Anh! I can help with technical questions about NEXA.</p></div><form><input aria-label="Message NEXA AI" placeholder="Describe the issue you need help with..." /><button>Send</button></form></aside>`);
  const orb = host.querySelector('#nexa-ai-orb');
  const chat = host.querySelector('#nexa-ai-chat');
  orb.addEventListener('click', () => { chat.classList.add('is-open'); chat.setAttribute('aria-hidden', 'false'); chat.querySelector('input').focus(); });
  chat.querySelector('[data-ai-close]').addEventListener('click', () => { chat.classList.remove('is-open'); chat.setAttribute('aria-hidden', 'true'); });
  chat.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = chat.querySelector('input');
    const message = input.value.trim();
    if (!message) return;
    const messages = chat.querySelector('.nexa-ai-messages');
    messages.insertAdjacentHTML('beforeend', `<p class="user-message">${message}</p><p class="ai-message">I’ve received that. Check the relevant tab and share any error message; I’ll guide you through the next step.</p>`);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
  });
}

function runProcessing() {
  const card = document.querySelector('.processing-card');
  clearTimeout(processingTimer); card.classList.remove('is-running', 'is-complete'); void card.offsetWidth; card.classList.add('is-running');
  processingTimer = window.setTimeout(() => card.classList.add('is-complete'), 5800);
}

function showPage(name, updateHistory = false) {
  const isProduct = productRoutes.has(name);
  const pageName = isProduct ? 'app' : basePages.has(name) ? name : 'home';
  pages.forEach((page) => page.classList.toggle('is-active', page.dataset.page === pageName));
  document.body.dataset.page = pageName; window.scrollTo({ top: 0, behavior: 'instant' });
  if (isProduct) { renderProduct(name); requestAnimationFrame(alignHeaderUtilities); }
  if (pageName === 'processing') runProcessing();
  if (updateHistory && window.location.hash !== `#${name}`) window.location.hash = name;
}

document.addEventListener('click', (event) => {
  const route = event.target.closest('[data-route]');
  if (route) { const fromLanding = route.closest('.landing-page') && route.dataset.route === 'onboarding'; const fromUpload = route.closest('.upload-card') && route.dataset.route === 'dashboard'; showPage(fromUpload ? 'processing' : fromLanding ? 'login' : route.dataset.route, true); }
  const menuToggle = event.target.closest('[data-profile-menu-toggle]');
  const profileMenu = document.querySelector('#profile-menu');
  if (menuToggle && profileMenu) {
    const isOpen = !profileMenu.hidden;
    profileMenu.hidden = isOpen;
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  } else if (!event.target.closest('.profile-menu-wrap') && profileMenu && !profileMenu.hidden) {
    profileMenu.hidden = true;
    document.querySelector('[data-profile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
  } else if (route?.closest('.profile-menu')) {
    profileMenu.hidden = true;
    document.querySelector('[data-profile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
  }
  const interest = event.target.closest('.interest-list button'); if (interest) interest.classList.toggle('selected');
  const action = event.target.closest('[data-ai-action]'); if (action) document.querySelector('#ai-question').value = `${action.dataset.aiAction}: `;
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const profileMenu = document.querySelector('#profile-menu');
  if (!profileMenu || profileMenu.hidden) return;
  profileMenu.hidden = true;
  document.querySelector('[data-profile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
});

document.querySelector('.upload-card .btn-primary').textContent = 'Submit';
function formatFileSize(bytes) { return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
document.querySelectorAll('.dropzone input[type="file"]').forEach((input) => input.addEventListener('change', () => { const zone = input.closest('.dropzone'); const file = input.files?.[0]; zone.classList.toggle('has-file', Boolean(file)); if (!file) return; const details = zone.querySelector('.file-item span'); details.firstChild.textContent = file.name; details.querySelector('small').textContent = formatFileSize(file.size); }));
window.addEventListener('hashchange', () => showPage(window.location.hash.slice(1)));
showPage(window.location.hash.slice(1) || 'home');
