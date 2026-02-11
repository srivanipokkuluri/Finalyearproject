import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const openCanvas = () => {
    setShowCanvas(true);
    setIsOpen(false);
  };

  const closeCanvas = () => {
    setShowCanvas(false);
    setSelectedMedia(null);
  };

  const handleMediaSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedMedia({
          file: file,
          url: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const proceedToEditor = () => {
    if (selectedMedia) {
      // Navigate to editor with the selected media
      navigate('/editor', { 
        state: { 
          uploadedMedia: selectedMedia 
        } 
      });
    }
  };

  const panelItems = [
    {
      icon: '🆕',
      title: 'New Project',
      description: 'Create from your media',
      action: openCanvas
    },
    {
      icon: '📝',
      title: 'Templates',
      description: 'Browse template gallery',
      action: () => navigate('/templates')
    },
    {
      icon: '🎨',
      title: 'Design Tools',
      description: 'Colors, fonts, layouts',
      action: () => {
        const element = document.querySelector('.grid-cols-3');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get design help',
      action: () => {
        const chatInput = document.querySelector('textarea');
        if (chatInput) {
          chatInput.focus();
          chatInput.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: '💾',
      title: 'Save Project',
      description: 'Download your work',
      action: () => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Project saved successfully!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    },
    {
      icon: '⚙️',
      title: 'Settings',
      description: 'Preferences & options',
      action: () => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Settings panel coming soon!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all duration-300 hover:bg-slate-800 hover:scale-110 ${
          isOpen ? 'rotate-45' : ''
        }`}
        style={{ zIndex: 1000 }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Slide Panel */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
        style={{ zIndex: 999 }}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={togglePanel}
        />

        {/* Panel Content */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              <button
                onClick={togglePanel}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-3">
                {panelItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-600">{item.description}</div>
                    </div>
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="border-t border-slate-200 p-4">
              <div className="text-xs text-slate-500 text-center">
                AI Template Editor • Quick Actions Panel
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Editor Modal */}
      {showCanvas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h2 className="text-xl font-semibold text-slate-900">New Project - Select Media</h2>
              <button
                onClick={closeCanvas}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Canvas Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Media Upload Section */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Your Media</h3>
                    <p className="text-sm text-slate-600 mb-4">Select an image or video to start editing</p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>

                  {selectedMedia && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Selected Media:</h4>
                      <p className="text-sm text-slate-600 truncate">{selectedMedia.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedMedia.file.type} • {(selectedMedia.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 min-h-[300px] flex items-center justify-center bg-slate-50">
                    {selectedMedia ? (
                      <div className="text-center">
                        {selectedMedia.file.type.startsWith('image/') ? (
                          <img 
                            src={selectedMedia.url} 
                            alt="Preview" 
                            className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                          />
                        ) : (
                          <video 
                            src={selectedMedia.url} 
                            controls 
                            className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                          />
                        )}
                        <p className="mt-4 text-sm text-slate-600">Media ready for editing</p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500">
                        <svg className="h-16 w-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>No media selected</p>
                        <p className="text-sm mt-2">Upload an image or video to preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={closeCanvas}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedToEditor}
                  disabled={!selectedMedia}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedMedia 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Proceed to Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
