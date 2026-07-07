import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Loader2, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMsg('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setAnalyzing(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resumes/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data.data.analysis);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload and analyze resume. Please verify the document format.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Resume AI Analyzer</h1>
        <p className="text-xs text-slate-400 mt-1">Upload your CV in PDF or DOCX format to analyze strengths, weaknesses, and benchmark ATS scores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Column */}
        <Card className="md:col-span-1 border-white/5 h-fit">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Select Document</h3>
          
          <label className="border border-dashed border-white/10 hover:border-indigo-500/50 bg-slate-950/40 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group">
            <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
            <FileUp className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 transition-colors mb-3" />
            <p className="text-xs font-bold text-slate-300">Click to upload file</p>
            <p className="text-[10px] text-slate-500 mt-1">PDF or Word DOCX files up to 10MB</p>
          </label>

          {file && (
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-300 truncate max-w-[120px] font-semibold">{file.name}</span>
              <span className="text-[10px] text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!file || analyzing} 
            variant="primary" 
            className="w-full mt-5 py-3"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing CV...
              </>
            ) : (
              <>
                Analyze Resume <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </Card>

        {/* Results Column */}
        <div className="md:col-span-2 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!result && !analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-white/5 flex flex-col items-center justify-center text-center py-20">
                  <FileUp className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-sm font-bold text-slate-400">Waiting for CV Submission</h3>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    Upload your resume on the left panel. The parser will extract keywords and benchmark your fit.
                  </p>
                </Card>
              </motion.div>
            )}

            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-white/5 flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-300">Extracting CV Structure</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Our models are parsing metadata and matching skills...</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {result && !analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Score Header */}
                <Card className="border-white/5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Evaluation Score</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Based on industry standard keywords checks</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-4xl font-extrabold text-indigo-300">{result.score}</span>
                      <span className="text-slate-400 text-sm font-bold">/100</span>
                    </div>
                  </div>
                </Card>

                {/* Skills Grid */}
                <Card className="border-white/5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Extracted Technical Skills</h4>
                  {result.skills && result.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No technical skills keywords identified.</p>
                  )}
                </Card>

                {/* Missing Skills Grid */}
                {result.missingSkills && result.missingSkills.length > 0 && (
                  <Card className="border-white/5">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">Missing Target Core Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-semibold text-amber-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Detailed Findings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <Card className="border-white/5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-green-400" /> Key Strengths
                    </h4>
                    <ul className="space-y-3">
                      {result.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />
                          {str}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Improvements */}
                  <Card className="border-white/5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-400" /> Focus Areas
                    </h4>
                    <ul className="space-y-3">
                      {result.weaknesses.map((weak, idx) => (
                        <li key={idx} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                          {weak}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* AI Recommendations */}
                <Card className="border-white/5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 text-indigo-400" /> Actionable Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {result.suggestions.map((sug, idx) => (
                      <li key={idx} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                        {sug}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
