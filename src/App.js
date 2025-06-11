import React, { useState } from 'react';

// Tailwind CSS is assumed to be available globally

// Simple SVG Icon Components
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.232l2.494.363a1 1 0 01.723 1.29l-1.805 1.759.426 2.483a1 1 0 01-1.451 1.054L12 13.347l-2.23.934a1 1 0 01-1.452-1.054l.426-2.483L6.939 8.885a1 1 0 01.723-1.29l2.494-.363L11.033 2.744A1 1 0 0112 2zm2.958 9.707a.5.5 0 00-.483-.244l-1.18.171-.527-1.105a.5.5 0 00-.94-.004L11.175 12.4l-1.18-.171a.5.5 0 00-.483.244L8.825 13.5l.213 1.242a.5.5 0 00.725.527l1.105-.461.527 1.105a.5.5 0 00.94.004l.652-1.37.213-1.242a.5.5 0 00-.725-.527L14.958 12.707z" clipRule="evenodd" />
    </svg>
);


const App = () => {
  const [formData, setFormData] = useState({
    industry: '',
    companySize: '',
    handlesPCI: 'no',
    handlesPHI: 'no',
    hasContractualObligations: 'no',
    isSubjectToGDPR: 'no',
    isFederalContractorCUI: 'no',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // State for Gemini API responses
  const [eli5Content, setEli5Content] = useState({}); // { frameworkId: "explanation" }
  const [firstStepsContent, setFirstStepsContent] = useState({}); // { frameworkId: "steps" }
  const [loadingStates, setLoadingStates] = useState({}); // { frameworkId_action: true/false }

  const industries = [
    { value: '', label: 'Select Industry...' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'other', label: 'Other' },
  ];

  const companySizes = [
    { value: '', label: 'Select Company Size...' },
    { value: '1-50', label: '1-50 employees' },
    { value: '51-250', label: '51-250 employees' },
    { value: '251-1000', label: '251-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const frameworkDetails = {
    NIST_CSF: {
      name: 'NIST Cybersecurity Framework (CSF)',
      description: 'A voluntary framework consisting of standards, guidelines, and best practices to manage cybersecurity risk. It\'s a great starting point for most organizations seeking to improve their cyber resilience.',
      link: 'https://www.nist.gov/cyberframework',
    },
    PCI_DSS: {
      name: 'PCI DSS (Payment Card Industry Data Security Standard)',
      description: 'A set of security standards designed to ensure that ALL companies that accept, process, store or transmit credit card information maintain a secure environment.',
      link: 'https://www.pcisecuritystandards.org/',
    },
    HIPAA: {
      name: 'HIPAA (Health Insurance Portability and Accountability Act) Security Rule',
      description: 'US legislation that provides data privacy and security provisions for safeguarding medical information. Applies to covered entities and business associates handling PHI.',
      link: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html',
    },
    GDPR: {
      name: 'GDPR (General Data Protection Regulation)',
      description: 'A regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area. It also addresses the transfer of personal data outside the EU and EEA areas.',
      link: 'https://gdpr-info.eu/',
    },
    NIST_SP_800_171_CMMC: {
      name: 'NIST SP 800-171 / CMMC (Cybersecurity Maturity Model Certification)',
      description: 'Required for U.S. Department of Defense contractors handling Controlled Unclassified Information (CUI). CMMC is the verification mechanism for NIST SP 800-171 compliance.',
      link: 'https://dodcio.defense.gov/CMMC/',
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowSuggestions(false);
    setEli5Content({}); // Reset Gemini content
    setFirstStepsContent({});
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowSuggestions(false);
    setEli5Content({}); // Reset Gemini content
    setFirstStepsContent({});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSuggestions = [];
    if (formData.handlesPCI === 'yes') {
      newSuggestions.push({ id: 'PCI_DSS', reason: 'You indicated that your organization processes, stores, or transmits Payment Card Industry Data (PCI).' });
    }
    if (formData.handlesPHI === 'yes' && formData.industry === 'healthcare') {
      newSuggestions.push({ id: 'HIPAA', reason: 'You indicated that your organization is in the healthcare industry and handles Protected Health Information (PHI).' });
    }
    if (formData.isFederalContractorCUI === 'yes') {
      newSuggestions.push({ id: 'NIST_SP_800_171_CMMC', reason: 'You indicated that your organization is a U.S. Federal Contractor handling Controlled Unclassified Information (CUI).' });
    }
    if (formData.isSubjectToGDPR === 'yes') {
      if (!newSuggestions.find(s => s.id === 'GDPR')) {
         newSuggestions.push({ id: 'GDPR', reason: 'You indicated that your organization is subject to GDPR requirements for data protection.'});
      }
    }
    let suggestNIST = false;
    const mandatoryFrameworksSuggested = newSuggestions.some(s => ['PCI_DSS', 'HIPAA', 'NIST_SP_800_171_CMMC'].includes(s.id));
    if (!mandatoryFrameworksSuggested) suggestNIST = true;
    if (formData.hasContractualObligations === 'yes' && !newSuggestions.find(s => s.id === 'NIST_CSF')) suggestNIST = true;
    if (suggestNIST && !newSuggestions.find(s => s.id === 'NIST_CSF')) {
         newSuggestions.push({ id: 'NIST_CSF', reason: formData.hasContractualObligations === 'yes' && !mandatoryFrameworksSuggested ? 'You indicated contractual obligations for security. NIST CSF provides a strong foundational framework.' : 'NIST CSF is recommended as a comprehensive foundational framework for improving cybersecurity posture.' });
    }
    if (newSuggestions.length === 0) {
        newSuggestions.push({ id: 'NIST_CSF', reason: 'NIST CSF is recommended as a versatile and comprehensive foundational framework suitable for a wide range of organizations looking to improve their cybersecurity posture.'});
    }
    const uniqueSuggestions = newSuggestions.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
    setSuggestions(uniqueSuggestions);
    setShowSuggestions(true);
  };

  // --- Gemini API Integration ---
  const callGeminiAPI = async (prompt, frameworkId, actionType) => {
    const loadingKey = `${frameworkId}_${actionType}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; // Provided by Canvas environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        if (actionType === 'eli5') {
          setEli5Content(prev => ({ ...prev, [frameworkId]: text }));
        } else if (actionType === 'firstSteps') {
          setFirstStepsContent(prev => ({ ...prev, [frameworkId]: text }));
        }
      } else {
        console.error("Gemini API Error: Unexpected response structure", result);
        throw new Error("Failed to parse content from API response.");
      }
    } catch (error) {
      console.error(`Error calling Gemini API for ${actionType} on ${frameworkId}:`, error);
      if (actionType === 'eli5') {
        setEli5Content(prev => ({ ...prev, [frameworkId]: "Sorry, I couldn't fetch that explanation. Please try again." }));
      } else if (actionType === 'firstSteps') {
        setFirstStepsContent(prev => ({ ...prev, [frameworkId]: "Sorry, I couldn't fetch those steps. Please try again." }));
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleEli5Request = (frameworkId, frameworkName) => {
    const prompt = `Explain the cybersecurity framework "${frameworkName}" like I'm 5 years old. Keep it very simple and short (2-3 sentences).`;
    callGeminiAPI(prompt, frameworkId, 'eli5');
  };

  const handleFirstStepsRequest = (frameworkId, frameworkName) => {
    const prompt = `What are 3-5 actionable first steps a small to medium-sized business can take to start implementing the "${frameworkName}" cybersecurity framework? Present them as a numbered list. Be concise.`;
    callGeminiAPI(prompt, frameworkId, 'firstSteps');
  };
  // --- End Gemini API Integration ---


  const QuestionWrapper = ({ title, children }) => (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">{title}</h3>
      {children}
    </div>
  );

  const RadioGroup = ({ name, options, currentValue, onChange, legend }) => (
    <fieldset className="mb-4">
      <legend className="text-base font-medium text-slate-700 mb-2">{legend}</legend>
      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
        {options.map(opt => (
          <label key={opt.value} className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-150 ease-in-out ${currentValue === opt.value ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500' : 'bg-slate-50 border-slate-300 hover:border-sky-400'}`}>
            <input type="radio" name={name} value={opt.value} checked={currentValue === opt.value} onChange={onChange} className="form-radio h-4 w-4 text-sky-600 focus:ring-sky-500 transition duration-150 ease-in-out"/>
            <span className={`text-sm font-medium ${currentValue === opt.value ? 'text-sky-700' : 'text-slate-700'}`}>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  const quotes = [
    { text: "A cybersecurity framework provides the blueprint for building a resilient organization against evolving digital threats.", author: "Industry Expert" },
    { text: "Without a framework, cybersecurity is just a collection of tools and practices. With one, it's a strategy.", author: "CIO Magazine" },
    { text: "Compliance isn't just a checkbox; it's a continuous commitment to security excellence, guided by a solid framework.", author: "Security Analyst"}
  ];
  const displayedQuote = quotes[0];


  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex flex-col items-center font-sans selection:bg-sky-100 selection:text-sky-700">
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center py-8">
          <div className="flex justify-center items-center mb-4"><ShieldIcon /></div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Cybersecurity Framework <span className="text-sky-600">Suggester</span></h1>
          <p className="text-slate-500 mt-3 text-base sm:text-lg max-w-2xl mx-auto">Navigate the complexities of cybersecurity. Answer a few questions to find a framework that fortifies your organization.</p>
          <div className="mt-6 text-center px-4">
            <blockquote className="relative p-4 text-sm italic text-slate-600 border-l-4 border-sky-500 bg-sky-50 rounded-r-lg">
              <p className="mb-0">"{displayedQuote.text}"</p>
              <cite className="block text-right text-xs text-slate-500 mt-1">- {displayedQuote.author}</cite>
            </blockquote>
          </div>
        </header>

        {!showSuggestions ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <QuestionWrapper title="About Your Organization">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-1">Primary Industry</label>
                  <select id="industry" name="industry" value={formData.industry} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-lg shadow-sm transition-colors duration-150 ease-in-out">
                    {industries.map((ind) => (<option key={ind.value} value={ind.value}>{ind.label}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="companySize" className="block text-sm font-semibold text-slate-700 mb-1">Company Size</label>
                  <select id="companySize" name="companySize" value={formData.companySize} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-lg shadow-sm transition-colors duration-150 ease-in-out">
                    {companySizes.map((size) => (<option key={size.value} value={size.value}>{size.label}</option>))}
                  </select>
                </div>
              </div>
            </QuestionWrapper>
            <QuestionWrapper title="Data & Contractual Profile">
              <RadioGroup name="handlesPCI" legend="Do you process, store, or transmit Payment Card Industry Data (PCI)?" options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} currentValue={formData.handlesPCI} onChange={handleRadioChange}/>
              <RadioGroup name="handlesPHI" legend="Do you handle Protected Health Information (PHI) (as defined by HIPAA in the US)?" options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} currentValue={formData.handlesPHI} onChange={handleRadioChange}/>
              <RadioGroup name="hasContractualObligations" legend="Do you have contractual security obligations from clients (e.g., government, large enterprises)?" options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} currentValue={formData.hasContractualObligations} onChange={handleRadioChange}/>
            </QuestionWrapper>
            <QuestionWrapper title="Regulatory Landscape">
              <RadioGroup name="isSubjectToGDPR" legend="Are you subject to GDPR (e.g., process data of EU residents)?" options={[{value: 'yes', label: 'Yes'}, {value: 'no', 'label': 'No'}]} currentValue={formData.isSubjectToGDPR} onChange={handleRadioChange}/>
              <RadioGroup name="isFederalContractorCUI" legend="Are you a U.S. Federal Contractor handling Controlled Unclassified Information (CUI)?" options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} currentValue={formData.isFederalContractorCUI} onChange={handleRadioChange}/>
            </QuestionWrapper>
            <div className="mt-10 pt-6 border-t border-slate-200 flex justify-center">
              <button type="submit" className="px-10 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-50 transition duration-150 ease-in-out transform hover:scale-105">
                Discover Your Framework
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-2 p-6 sm:p-10 bg-white rounded-xl shadow-xl border border-slate-200">
            <div className="flex items-center justify-center mb-6">
                <DocumentTextIcon />
                <h2 className="text-3xl font-semibold text-slate-800 ml-3">Recommended Frameworks</h2>
            </div>
            {suggestions.length > 0 ? (
              <ul className="space-y-6">
                {suggestions.map((sug) => (
                  <li key={sug.id} className="p-6 bg-slate-50 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-150">
                    <h3 className="text-xl font-bold text-sky-700 mb-2">{frameworkDetails[sug.id]?.name}</h3>
                    <p className="text-sm text-slate-600 mb-1"><strong className="text-slate-700">Reason:</strong> {sug.reason}</p>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{frameworkDetails[sug.id]?.description}</p>
                    
                    {/* Gemini API Feature Buttons */}
                    <div className="my-4 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row">
                        <button
                            onClick={() => handleEli5Request(sug.id, frameworkDetails[sug.id]?.name)}
                            disabled={loadingStates[`${sug.id}_eli5`]}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <SparklesIcon />
                            {loadingStates[`${sug.id}_eli5`] ? 'Thinking...' : "✨ Explain Like I'm 5"}
                        </button>
                        <button
                            onClick={() => handleFirstStepsRequest(sug.id, frameworkDetails[sug.id]?.name)}
                            disabled={loadingStates[`${sug.id}_firstSteps`]}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                           <SparklesIcon />
                           {loadingStates[`${sug.id}_firstSteps`] ? 'Generating...' : '✨ Suggest First Steps'}
                        </button>
                    </div>

                    {/* Display ELI5 Content */}
                    {eli5Content[sug.id] && (
                        <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-md">
                            <h4 className="text-xs font-semibold text-sky-600 mb-1">Simplified Explanation:</h4>
                            <p className="text-xs text-slate-700 whitespace-pre-wrap">{eli5Content[sug.id]}</p>
                        </div>
                    )}

                    {/* Display First Steps Content */}
                    {firstStepsContent[sug.id] && (
                        <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-md">
                            <h4 className="text-xs font-semibold text-sky-600 mb-1">Actionable First Steps:</h4>
                            <p className="text-xs text-slate-700 whitespace-pre-wrap">{firstStepsContent[sug.id]}</p>
                        </div>
                    )}
                    {/* End Gemini Content Display */}

                    <a href={frameworkDetails[sug.id]?.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-sky-600 hover:text-sky-800 font-semibold group mt-4">
                      Learn more about {frameworkDetails[sug.id]?.name}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 text-center py-8">No specific framework suggestions based on your input. Consider NIST CSF as a general starting point or consult a cybersecurity professional.</p>
            )}
             <div className="mt-10 pt-6 border-t border-slate-200 flex justify-center">
                <button onClick={() => { setShowSuggestions(false); setFormData({ industry: '', companySize: '', handlesPCI: 'no', handlesPHI: 'no', hasContractualObligations: 'no', isSubjectToGDPR: 'no', isFederalContractorCUI: 'no' }); setEli5Content({}); setFirstStepsContent({}); setLoadingStates({});}} className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white transition duration-150 ease-in-out transform hover:scale-105">
                    Start Over & Refine
                </button>
            </div>
          </div>
        )}
         <footer className="mt-16 mb-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Cybersecurity Framework Suggester. For informational purposes only.</p>
            <p>This is an open-source project concept. Always consult with qualified cybersecurity professionals for specific advice tailored to your organization.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
