import axios from "axios";

const deleteUserInfo = () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("authenticationToken");
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  responseType: "json"
});
// Request interceptor that adds params expected by the backend api
instance.interceptors.request.use(
  function(config) {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authenticationToken");
    config.url = `${config.url}?user_email=${email}&authentication_token=${token}`;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
// Response interceptor that renders the login page for a response with status code 401
instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      deleteUserInfo();
      window.location = "/";
    }
    return Promise.reject(error);
  }
);

/**
 * QuestionSet
 */
export const getQuestionSets = (page, perPage) => {
  if (page && perPage)
    return instance.get("/question_sets", {
      params: { page: page, per_page: perPage }
    });
  else return instance.get("/question_sets");
};

export const getQuestionSetCount = () => {
  return instance.get("/question_sets/total");
};

export const createQuestionSet = questionSet => {
  return instance.post("/question_sets", questionSet);
};

export const updateQuestionSet = (id, questionSet) => {
  return instance.put(`/question_sets/${id}`, questionSet);
};

export const deleteQuestionSet = id => {
  return instance.delete(`/question_sets/${id}`);
};

/**
 * Folder
 */
export const getFolders = questionSetId => {
  return instance.get(`/question_sets/${questionSetId}/folders`);
};

export const createFolder = (questionSetId, folder) => {
  return instance.post(`/question_sets/${questionSetId}/folders`, folder);
};

export const updateFolder = (questionSetId, id, folder) => {
  return instance.put(`/question_sets/${questionSetId}/folders/${id}`, folder);
};

export const deleteFolder = (questionSetId, id) => {
  return instance.delete(`/question_sets/${questionSetId}/folders/${id}`);
};

/**
 * Questions
 */
export const getAllQuestions = () => {
  return instance.get("/questions");
};

export const getQuestions = folder => {
  return instance.get(
    `/question_sets/${folder.question_set_id}/folders/${folder.id}/questions`
  );
};

export const createQuestion = question => {
  return instance.post(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions`,
    { question: question }
  );
};

export const updateQuestion = question => {
  return instance.put(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions/${question.id}`,
    { question: question }
  );
};

export const deleteQuestion = question => {
  return instance.delete(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions/${question.id}`
  );
};

/**
 * OptionSet
 */
export const getOptionSets = (page, perPage) => {
  if (page && perPage)
    return instance.get("/option_sets", {
      params: { page: page, per_page: perPage }
    });
  else return instance.get("/option_sets");
};

export const getOptionSetCount = () => {
  return instance.get("/option_sets/total");
};

export const getOptionSet = id => {
  return instance.get(`/option_sets/${id}`);
};

export const createOptionSet = optionSet => {
  return instance.post("/option_sets", optionSet);
};

export const updateOptionSet = (id, optionSet) => {
  return instance.put(`/option_sets/${id}`, optionSet);
};

export const deleteOptionSet = id => {
  return instance.delete(`/option_sets/${id}`);
};

/**
 * Instruction
 */
export const getInstructions = () => {
  return instance.get("/instructions");
};

export const updateInstruction = (id, instruction) => {
  return instance.put(`/instructions/${id}`, instruction);
};

export const createInstruction = instruction => {
  return instance.post("/instructions", instruction);
};

export const deleteInstruction = id => {
  return instance.delete(`/instructions/${id}`);
};

/**
 * Option
 */
export const getOptions = () => {
  return instance.get("/options");
};

export const createOption = option => {
  return instance.post("/options", option);
};

export const updateOption = (id, option) => {
  return instance.put(`/options/${id}`, option);
};

export const deleteOption = id => {
  return instance.delete(`/options/${id}`);
};

/**
 * OptionTranslation
 */
export const getOptionTranslations = language => {
  return instance.get("/option_translations", {
    params: { language: language }
  });
};

export const createOptionTranslation = translation => {
  return instance.post("/option_translations", translation);
};

export const updateOptionTranslation = (id, translation) => {
  return instance.put(`/option_translations/${id}`, translation);
};

export const deleteOptionTranslation = id => {
  return instance.delete(`/option_translations/${id}`);
};

/**
 * OptionInOptionSet
 */
export const deleteOptionInOptionSet = (optionSetId, id) => {
  return instance.delete(
    `/option_sets/${optionSetId}/option_in_option_sets/${id}`
  );
};

/*
Project
*/
export const getProjects = () => {
  return instance.get("/projects");
};

export const getInstruments = () => {
  return instance.get("/instruments");
};

/*
Instrument
*/
export const getInstrument = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}`);
};

export const createInstrument = (projectId, instrument) => {
  return instance.post(`/projects/${projectId}/instruments`, instrument);
};

export const updateInstrument = (projectId, id, instrument) => {
  return instance.put(`/projects/${projectId}/instruments/${id}`, instrument);
};

export const deleteInstrument = (projectId, id) => {
  return instance.delete(`/projects/${projectId}/instruments/${id}`);
};

export const reorderInstrumentQuestions = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}/reorder`);
};

/*
Section
*/
export const getSections = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/sections`
  );
};

export const getSection = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`
  );
};

export const createSection = (projectId, instrumentId, section) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/sections`,
    section
  );
};

export const updateSection = (projectId, instrumentId, id, section) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`,
    section
  );
};

export const deleteSection = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`
  );
};

/*
Display
*/
export const getDisplay = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`
  );
};

export const createDisplay = (projectId, instrumentId, display) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/displays`,
    display
  );
};

export const updateDisplay = (projectId, instrumentId, id, display) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`,
    display
  );
};

export const deleteDisplay = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`
  );
};

/**DisplayInstruction */
export const getDisplayInstructions = (projectId, instrumentId, displayId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions`
  );
};

export const createDisplayInstruction = (
  projectId,
  instrumentId,
  displayId,
  di
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions`,
    di
  );
};

export const updateDisplayInstruction = (
  projectId,
  instrumentId,
  displayId,
  di
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions/${di.id}`,
    di
  );
};

export const deleteDisplayInstruction = (
  projectId,
  instrumentId,
  displayId,
  id
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions/${id}`
  );
};

/*
 * InstrumentQuestion
 */
export const createInstrumentQuestion = (projectId, instrumentId, iQ) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions`,
    iQ
  );
};

export const updateInstrumentQuestion = (projectId, instrumentQuestion) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentQuestion.instrument_id}/instrument_questions/${instrumentQuestion.id}`,
    instrumentQuestion
  );
};

export const deleteInstrumentQuestion = (projectId, instrumentQuestion) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentQuestion.instrument_id}/instrument_questions/${instrumentQuestion.id}`,
    instrumentQuestion
  );
};

/**
 * ScoringScheme
 */
export const getScoreSchemes = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`
  );
};

export const createScoreScheme = (projectId, instrumentId, scheme) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`,
    scheme
  );
};

export const updateScoreScheme = (projectId, instrumentId, id, scheme) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`,
    scheme
  );
};

export const deleteScoreScheme = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`
  );
};

/**
 * Domains
 */
export const getDomains = (projectId, instrumentId, scoreSchemeId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/domains`
  );
};

export const getDomain = (projectId, instrumentId, scoreSchemeId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/domains/${id}`
  );
};

export const createDomain = (instrument, domain) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains`,
    domain
  );
};

export const updateDomain = (instrument, domain) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}`,
    domain
  );
};

export const deleteDomain = (instrument, domain) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}`
  );
};

/**
 * Subdomains
 */
export const createSubdomain = (instrument, scoreSchemeId, subdomain) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains`,
    subdomain
  );
};

export const updateSubdomain = (instrument, scoreSchemeId, subdomain) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${subdomain.id}`,
    subdomain
  );
};

export const deleteSubdomain = (instrument, scoreSchemeId, subdomain) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${subdomain.id}`
  );
};

/**
 * ScoreUnit
 */
export const getScoreUnits = (instrument, scoreSchemeId, subdomainId) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${subdomainId}/score_units`
  );
};

export const createScoreUnit = (instrument, scoreSchemeId, scoreUnit) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units`,
    scoreUnit
  );
};

export const updateScoreUnit = (instrument, scoreSchemeId, scoreUnit) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}`,
    scoreUnit
  );
};

export const deleteScoreUnit = (instrument, scoreSchemeId, scoreUnit) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}`
  );
};

/**
 * OptionScore
 */
export const deleteOptionScore = (instrument, scoreSchemeId, scoreUnit, id) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores/${id}`
  );
};

/** Survey */
export const getSurveys = () => {
  return instance.get("/surveys");
};

/** Response */
export const getResponses = surveyId => {
  return instance.get(`/surveys/${surveyId}/responses`);
};

// Instance without interceptors
const authInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  responseType: "json"
});

export const login = user => {
  localStorage.setItem("userEmail", user.email);
  return authInstance
    .post("/login", {
      user
    })
    .then(res => {
      localStorage.setItem(
        "authenticationToken",
        res.data.authentication_token
      );
      window.location = "/";
    });
};

export const logout = () => {
  const token = localStorage.getItem("authenticationToken");
  return authInstance
    .delete(`/logout?authentication_token=${token}`)
    .then(() => {
      deleteUserInfo();
    });
};
