document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.getElementById('portfolioForm');
  const steps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const progressSteps = document.querySelectorAll('.progress-step');


  let currentStep = 0;


  // Show the current step and update progress bar
  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });


    progressSteps.forEach((step, i) => {
      step.classList.toggle('active', i <= index);
    });


    updateNextButtonState();
  }


  showStep(currentStep);


  // Validation function with inline error messages
  function validateStep(stepIndex) {
    let valid = true;


    clearErrorMessages(stepIndex);


    if(stepIndex === 0) {
      const name = document.getElementById('nameInput').value.trim();
      if(name === '') {
        showError('nameInput', 'Please enter your name');
        valid = false;
      }
    }
    else if(stepIndex === 1) {
      const skillInputs = document.querySelectorAll('.skill-input');
      const hasSkill = Array.from(skillInputs).some(input => input.value.trim() !== '');
      if(!hasSkill) {
        showError('skillsContainer', 'Please add at least one skill');
        valid = false;
      }
    }
    else if(stepIndex === 2) {
      const projectTitles = document.querySelectorAll('.project-title');
      const hasProjectTitle = Array.from(projectTitles).some(input => input.value.trim() !== '');
      if(!hasProjectTitle) {
        showError('projectsContainer', 'Please add at least one project title');
        valid = false;
      }
    }
    else if(stepIndex === 3) {
      const email = document.getElementById('emailInput').value.trim();
      if(email === '') {
        showError('emailInput', 'Please enter your email');
        valid = false;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)) {
          showError('emailInput', 'Please enter a valid email');
          valid = false;
        }
      }
    }


    return valid;
  }


  // Show error message next to input or container
  function showError(elementId, message) {
    let element = document.getElementById(elementId);
    let errorElem = document.createElement('div');
    errorElem.className = 'error-message';
    errorElem.textContent = message;
    if(element) {
      if(elementId === 'skillsContainer' || elementId === 'projectsContainer') {
        element.parentNode.insertBefore(errorElem, element.nextSibling);
      } else {
        if(!element.nextSibling || !element.nextSibling.classList || !element.nextSibling.classList.contains('error-message')) {
          element.parentNode.insertBefore(errorElem, element.nextSibling);
        }
      }
      errorElem.style.display = 'block';
    }
  }


  // Clear error messages for current step
  function clearErrorMessages(stepIndex) {
    if(stepIndex === 0) {
      removeErrorMessage('nameInput');
    } else if(stepIndex === 1) {
      removeErrorMessage('skillsContainer');
    } else if(stepIndex === 2) {
      removeErrorMessage('projectsContainer');
    } else if(stepIndex === 3) {
      removeErrorMessage('emailInput');
    }
  }


  function removeErrorMessage(elementId) {
    let element = document.getElementById(elementId);
    if(element && element.nextSibling && element.nextSibling.classList && element.nextSibling.classList.contains('error-message')) {
      element.parentNode.removeChild(element.nextSibling);
    }
  }


  // Handle next step navigation
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(validateStep(currentStep)) {
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      }
    });
  });


  // Handle previous step navigation
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });


  // Update next button disabled state depending on validation
  function updateNextButtonState() {
    const nextBtn = steps[currentStep].querySelector('.next-btn');
    if(nextBtn) {
      nextBtn.disabled = !validateStep(currentStep);
    }
  }


  // Listen for input changes to dynamically enable next button
  ['input', 'change'].forEach(event => {
    form.addEventListener(event, () => {
      updateNextButtonState();
    });
  });


  // Live Preview Elements and Inputs
  const nameInput = document.getElementById('nameInput');
  const aboutInput = document.getElementById('aboutInput');
  const skillsContainer = document.getElementById('skillsContainer');
  const projectsContainer = document.getElementById('projectsContainer');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');


  const previewName = document.getElementById('previewName');
  const previewAboutText = document.getElementById('previewAboutText');
  const previewSkillsList = document.getElementById('previewSkillsList');
  const previewProjectsList = document.getElementById('previewProjectsList');
  const previewEmail = document.getElementById('previewEmail');
  const previewPhone = document.getElementById('previewPhone');


  // Update preview for About Me
  nameInput.addEventListener('input', () => {
    previewName.textContent = nameInput.value || "Your Name";
  });


  aboutInput.addEventListener('input', () => {
    previewAboutText.textContent = aboutInput.value || "Your professional summary will appear here.";
  });


  // Add Skill input dynamically
  document.getElementById('addSkillBtn').addEventListener('click', () => {
    const skillInput = document.createElement('input');
    skillInput.type = 'text';
    skillInput.className = 'skill-input';
    skillInput.placeholder = 'Add a skill';
    skillsContainer.appendChild(skillInput);


    // Attach input listener to update preview dynamically on new skill inputs
    skillInput.addEventListener('input', updateSkillsPreview);
  });


  // Update Skills preview list
  function updateSkillsPreview() {
    const skillInputs = document.querySelectorAll('.skill-input');
    previewSkillsList.innerHTML = '';
    skillInputs.forEach(input => {
      if (input.value.trim() !== '') {
        const li = document.createElement('li');
        li.textContent = input.value.trim();
        previewSkillsList.appendChild(li);
      }
    });
  }


  // Initial skill input listener
  document.querySelector('.skill-input').addEventListener('input', updateSkillsPreview);


  // Add Project item dynamically
  document.getElementById('addProjectBtn').addEventListener('click', () => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-item';


    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'project-title';
    titleInput.placeholder = 'Project Title';


    const descTextarea = document.createElement('textarea');
    descTextarea.className = 'project-desc';
    descTextarea.rows = 3;
    descTextarea.placeholder = 'Project Description';


    projectDiv.appendChild(titleInput);
    projectDiv.appendChild(descTextarea);
    projectsContainer.appendChild(projectDiv);


    // Attach input listeners to update preview on changes
    titleInput.addEventListener('input', updateProjectsPreview);
    descTextarea.addEventListener('input', updateProjectsPreview);
  });


  // Update Projects preview list
  function updateProjectsPreview() {
    const projectTitles = document.querySelectorAll('.project-title');
    const projectDescs = document.querySelectorAll('.project-desc');


    previewProjectsList.innerHTML = '';


    for (let i = 0; i < projectTitles.length; i++) {
      const title = projectTitles[i].value.trim();
      const desc = projectDescs[i].value.trim();


      if (title !== '' || desc !== '') {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'preview-project';


        const h3 = document.createElement('h3');
        h3.textContent = title || 'Untitled Project';


        const p = document.createElement('p');
        p.textContent = desc || '';


        projectDiv.appendChild(h3);
        projectDiv.appendChild(p);
        previewProjectsList.appendChild(projectDiv);
      }
    }
  }


  // Initial project inputs listeners
  document.querySelector('.project-title').addEventListener('input', updateProjectsPreview);
  document.querySelector('.project-desc').addEventListener('input', updateProjectsPreview);


  // Update Contact info preview
  emailInput.addEventListener('input', () => {
    previewEmail.textContent = emailInput.value || '';
  });


  phoneInput.addEventListener('input', () => {
    previewPhone.textContent = phoneInput.value || '';
  });


  // Handle form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(validateStep(currentStep)) {
      alert('Portfolio generation feature coming soon!');
      // Here you can add export or save portfolio logic
    }
  });

  // Added: Download Portfolio as HTML button handler
  document.getElementById('exportHtmlBtn').addEventListener('click', () => {
    const previewContent = document.getElementById('portfolioPreview').innerHTML;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Your Portfolio</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: auto; }
          h1, h2 { color: #2980B9; }
          p, li { color: #34495E; line-height: 1.6; }
          ul { padding-left: 20px; }
          .preview-project { background-color: #ecf0f1; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        ${previewContent}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();

    URL.revokeObjectURL(url);
  });
});
