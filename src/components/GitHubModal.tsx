import React, { useState } from 'react';
import { 
  Github, 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Download, 
  Key, 
  Terminal, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Lock, 
  Globe,
  ArrowRight,
  HelpCircle,
  FolderGit2
} from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'cli' | 'zip'>('direct');
  const [username, setUsername] = useState('Lakshmeesha03ke');
  const [repoName, setRepoName] = useState('prepilot');
  const [token, setToken] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  
  // Status states
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);
  const [pushError, setPushError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setPushError('Please paste your GitHub Personal Access Token.');
      return;
    }

    setIsPushing(true);
    setPushError(null);
    setPushSuccess(null);

    try {
      const response = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          repoName: repoName.trim() || 'prepilot',
          token: token.trim(),
          isPrivate,
        }),
      });

      const data = await response.json();

      if (data.success && data.repoUrl) {
        setPushSuccess(data.repoUrl);
      } else {
        setPushError(data.error || 'Failed to push repository. Please check your token permissions.');
      }
    } catch (err: any) {
      setPushError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsPushing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const cliCommands = [
    `# 1. If pushing from your computer or workspace:`,
    `git remote add origin https://github.com/${username}/${repoName || 'prepilot'}.git`,
    `git branch -M main`,
    `git push -u origin main`
  ].join('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white shadow-inner">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Push to GitHub</h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  @{username}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Publish PrePilot directly to your GitHub account or export source code
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'direct'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            1-Click Direct Push
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'cli'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Git Terminal
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`pb-3 px-3 text-xs md:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'zip'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Download className="w-4 h-4" />
            Download ZIP
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Direct Push Tab */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              {pushSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-300">Successfully Pushed to GitHub!</h4>
                    <p className="text-xs text-emerald-400/90 mt-1">
                      Your repository is live with complete codebase, README, icons, and configuration.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <a
                      href={pushSuccess}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                    >
                      View on GitHub <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setPushSuccess(null)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Push Again / Update
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePush} className="space-y-4">
                  {/* Account link notice */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-slate-300">Target GitHub Profile:</span>
                      <a 
                        href={`https://github.com/${username}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-semibold text-sky-400 hover:underline flex items-center gap-1"
                      >
                        github.com/{username} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Username */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                        required
                      />
                    </div>

                    {/* Repository Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Repository Name
                      </label>
                      <input
                        type="text"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="prepilot"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      {isPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Globe className="w-4 h-4 text-sky-400" />}
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {isPrivate ? 'Private Repository' : 'Public Repository (Recommended)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isPrivate ? 'Only you and authorized collaborators can see it' : 'Visible on your GitHub portfolio for recruiters & campus hiring'}
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isPrivate} 
                        onChange={(e) => setIsPrivate(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* GitHub Token Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-sky-400" />
                        GitHub Personal Access Token (PAT)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTokenHelp(!showTokenHelp)}
                        className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle className="w-3 h-3" />
                        Where do I get this?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono tracking-wider"
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Tokens are processed in-memory for the git push operation and never saved or stored.
                    </p>
                  </div>

                  {/* Token Help Box */}
                  {showTokenHelp && (
                    <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 space-y-2">
                      <div className="font-semibold text-sky-300 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5" /> Quick 30-Second Guide to create token:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                        <li>
                          Click here to open{' '}
                          <a 
                            href="https://github.com/settings/tokens/new?scopes=repo&description=PrePilot%20Deployment" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-sky-400 underline font-semibold inline-flex items-center gap-1"
                          >
                            GitHub Token Generator <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </li>
                        <li>Give it note "PrePilot" and check the <strong>repo</strong> checkbox (Full control of private repositories).</li>
                        <li>Click <strong>Generate token</strong> at the bottom.</li>
                        <li>Copy the generated code (<code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300">ghp_...</code>) and paste it above!</li>
                      </ol>
                    </div>
                  )}

                  {pushError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>{pushError}</div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPushing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-60"
                  >
                    {isPushing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Repository & Pushing to GitHub...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        Push Project to https://github.com/{username}/{repoName || 'prepilot'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Git Terminal CLI Tab */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                You can push the repository manually using your computer terminal or git client.
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 relative group">
                <button
                  onClick={() => handleCopy(cliCommands, 1)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === 1 ? 'Copied!' : 'Copy'}
                </button>
                <div className="text-slate-500 font-bold mb-1"># Run in your project root:</div>
                <div className="text-amber-400">git remote add origin https://github.com/{username}/{repoName || 'prepilot'}.git</div>
                <div className="text-sky-300">git branch -M main</div>
                <div className="text-emerald-400">git push -u origin main</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-sky-400" />
                  First time creating the repo on GitHub?
                </div>
                <p className="text-[11px] text-slate-400">
                  Make sure you have created an empty repository named <strong className="text-white">{repoName || 'prepilot'}</strong> at{' '}
                  <a 
                    href="https://github.com/new" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sky-400 hover:underline"
                  >
                    https://github.com/new
                  </a>{' '}
                  (without initializing with README since our project already includes one).
                </p>
              </div>
            </div>
          )}

          {/* Download ZIP Tab */}
          {activeTab === 'zip' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <Download className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">Download PrePilot Clean ZIP</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Downloads all source code, components, question banks, AI endpoints, and configs directly. Excludes heavy node_modules for instant download.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="/api/export/zip"
                  download="prepilot-placement-platform.zip"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  Download Project Archive (.ZIP)
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs text-slate-400 max-w-lg mx-auto">
                <div className="text-slate-300 font-semibold mb-1">To run on your local machine:</div>
                <div className="text-sky-400">1. unzip prepilot-placement-platform.zip</div>
                <div className="text-sky-400">2. cd prepilot-placement-platform</div>
                <div className="text-sky-400">3. npm install</div>
                <div className="text-emerald-400">4. npm run dev</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Github className="w-4 h-4 text-slate-300" />
            <span>Target: </span>
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-sky-400 hover:underline font-mono"
            >
              github.com/{username}
            </a>
          </div>
          <button 
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
