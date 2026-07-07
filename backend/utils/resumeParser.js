/**
 * Production-ready rule-based resume parser and ATS scoring engine
 */

const TECH_DICTIONARY = {
  frontend: ['react', 'angular', 'vue', 'redux', 'next.js', 'typescript', 'javascript', 'tailwind', 'bootstrap', 'html', 'css', 'webpack', 'vite', 'sass'],
  backend: ['node', 'express', 'django', 'flask', 'fastapi', 'spring boot', 'laravel', 'nest.js', 'graphql', 'rest api', 'postgresql', 'mysql', 'mongodb', 'redis', 'firebase', 'sqlite'],
  devops: ['aws', 'docker', 'kubernetes', 'jenkins', 'git', 'github actions', 'ci/cd', 'nginx', 'gcp', 'azure', 'terraform', 'ansible'],
  testing: ['jest', 'vitest', 'cypress', 'playwright', 'selenium', 'mocha', 'chai'],
  languages: ['python', 'golang', 'ruby', 'java', 'c++', 'c#', 'php', 'rust', 'scala']
};

const DEFAULT_TARGET_STACK = [
  'react', 'typescript', 'node', 'express', 'mongodb', 'docker', 'aws', 'jest', 'git', 'ci/cd'
];

export const parseResumeText = (text) => {
  if (!text) {
    return {
      score: 0,
      skills: [],
      missingSkills: [],
      sections: { experience: false, education: false, projects: false },
      strengths: [],
      weaknesses: [],
      suggestions: []
    };
  }

  const lowercaseText = text.toLowerCase();
  
  // 1. Extract Skills
  const extractedSkills = [];
  Object.values(TECH_DICTIONARY).forEach((categoryList) => {
    categoryList.forEach((skill) => {
      // Use boundary check to avoid substring matches e.g. "git" matching inside "digital"
      const skillRegex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
      if (skillRegex.test(lowercaseText)) {
        extractedSkills.push(skill);
      }
    });
  });

  // Capitalize skills for presentation
  const skills = [...new Set(extractedSkills)].map(s => 
    s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );

  // 2. Identify Sections
  const experienceRegex = /(work experience|experience|employment history|professional experience|professional history|work history)/i;
  const educationRegex = /(education|academic background|studies|degrees)/i;
  const projectsRegex = /(projects|personal projects|selected projects|portfolio)/i;

  const sections = {
    experience: experienceRegex.test(lowercaseText),
    education: educationRegex.test(lowercaseText),
    projects: projectsRegex.test(lowercaseText)
  };

  // 3. Find Missing Skills (comparing to our default high-demand stack)
  const missingSkills = DEFAULT_TARGET_STACK
    .filter(skill => !extractedSkills.includes(skill))
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // 4. Calculate ATS Score
  let score = 40; // Base score for layout

  // Add points for sections detected
  if (sections.experience) score += 15;
  if (sections.education) score += 15;
  if (sections.projects) score += 10;

  // Add points for skills density (up to 20 points)
  const skillsScore = Math.min(20, extractedSkills.length * 2);
  score += skillsScore;

  // 5. Generate Strengths, Weaknesses, and Suggestions
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  // Strengths Audit
  if (extractedSkills.length >= 6) {
    strengths.push('Diverse technical vocabulary with strong modern stack alignment.');
  }
  if (sections.experience) {
    strengths.push('Clearly demarcated Professional History segment showing career growth.');
  }
  if (sections.projects) {
    strengths.push('Projects section present, demonstrating hands-on technical execution.');
  }

  // Weaknesses Audit
  if (extractedSkills.length < 5) {
    weaknesses.push('Low technology keyword count. The CV may be filtered out by automated scanners.');
  }
  if (!sections.experience) {
    weaknesses.push('Missing explicit "Work Experience" or "Employment History" section.');
  }
  if (!sections.projects) {
    weaknesses.push('No portfolio or personal projects listed to showcase self-directed learning.');
  }
  if (missingSkills.length > 3) {
    weaknesses.push(`Missing high-demand full stack core keywords like ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  // Suggestions Audit
  if (!sections.experience) {
    suggestions.push('Create a dedicated "Experience" block with chronological job roles.');
  }
  if (!sections.projects) {
    suggestions.push('Add 2-3 personal or open-source projects including links to repositories.');
  }
  if (missingSkills.length > 0) {
    suggestions.push(`Consider acquiring or highlighting keywords: ${missingSkills.slice(0, 4).join(', ')}.`);
  }
  if (extractedSkills.length < 8) {
    suggestions.push('Incorporate core frameworks and libraries you have worked with to satisfy ATS filters.');
  }

  return {
    score,
    skills,
    missingSkills,
    sections,
    strengths: strengths.length > 0 ? strengths : ['Basic layout structure matches standard format rules.'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['No major formatting or structure omissions detected.'],
    suggestions: suggestions.length > 0 ? suggestions : ['Review formatting margin spacing to ensure single page constraints.']
  };
};
