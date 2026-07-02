import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useEffect, useState } from "react";
import { FileManagerModal } from "../FileManager/FileManagerModal";

export interface RichEditorProps {
  value: string;
  onChange: any;
  font?: boolean;
  fontsize?: boolean;
}
let mainEditor: any;
export const BeamEditor = forwardRef<any, RichEditorProps>((props, ref) => {
  const { value, onChange, font, fontsize } = props;
  const [isOpenFileManagement, setIsOpenFileManagement] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div ref={ref} style={{ height: 500 }} />;
  }
  const onSelectFile = (file: any) => {
    if (file && file.length) {
      mainEditor?.editorManager?.activeEditor?.selection?.setContent(
        `<img src="${file}"/>`
      );
    }
    setIsOpenFileManagement(false);
  };
  const onOpenPicker = async () => {
    setIsOpenFileManagement(true);
  };

  return (
    <div ref={ref}>
      <Editor
        value={value}
        onEditorChange={onChange}
        init={{
          height: 500,
          menubar: false,
          toolbar_mode: 'wrap',
          setup: (editor: any) => {
            mainEditor = editor;
            editor.ui.registry.addButton("file_manager", {
              icon: "image",
              onAction: onOpenPicker,
            });
            
            // Thêm xử lý phím Ctrl+Enter
            editor.addShortcut('ctrl+13', 'Exit block or create new line', function() {
              const selection = editor.selection;
              const node = selection.getNode();
              
              // Xử lý cho callout
              const calloutBox = node.closest('.callout-box');
              if (calloutBox) {
                // Tạo một dòng mới sau callout
                const newParagraph = editor.dom.create('p', {}, '&nbsp;');
                editor.dom.insertAfter(newParagraph, calloutBox);
                selection.setCursorLocation(newParagraph, 0);
                return true;
              }
              
              // Xử lý cho collapse (toggle)
              const toggleContent = node.closest('.notion-toggle-content');
              if (toggleContent) {
                const toggleWrapper = toggleContent.closest('.notion-toggle-wrapper');
                if (toggleWrapper) {
                  // Kiểm tra xem có phải là collapse lồng nhau không
                  const parentToggle = editor.dom.getParent(toggleWrapper, '.notion-toggle-content');
                  if (parentToggle) {
                    // Di chuyển con trỏ ra khỏi collapse hiện tại đến collapse cha
                    selection.setCursorLocation(parentToggle, 0);
                  } else {
                    // Không có collapse cha, tạo dòng mới sau collapse
                    const newParagraph = editor.dom.create('p', {}, '&nbsp;');
                    editor.dom.insertAfter(newParagraph, toggleWrapper);
                    selection.setCursorLocation(newParagraph, 0);
                  }
                  return true;
                }
              }
              
              // Xử lý cho quote
              const quote = node.closest('blockquote.custom-quote');
              if (quote) {
                // Tạo một dòng mới sau quote
                const newParagraph = editor.dom.create('p', {}, '&nbsp;');
                editor.dom.insertAfter(newParagraph, quote);
                selection.setCursorLocation(newParagraph, 0);
                return true;
              }
              
              return false;
            });
            
            editor.ui.registry.addMenuButton('callout_box', {
              icon: 'info',
              tooltip: 'Callout Box',
              fetch: function (callback: any) {
                const items = [
                  {
                    type: 'menuitem',
                    text: 'Info',
                    icon: 'info',
                    onAction: function () {
                      editor.insertContent('<div class="callout-box callout-info"><div class="callout-icon">💡</div><div class="callout-content"><p>Information callout</p></div></div><p>&nbsp;</p>');
                    }
                  },
                  {
                    type: 'menuitem',
                    text: 'Warning',
                    icon: 'warning',
                    onAction: function () {
                      editor.insertContent('<div class="callout-box callout-warning"><div class="callout-icon">⚠️</div><div class="callout-content"><p>Warning callout</p></div></div><p>&nbsp;</p>');
                    }
                  },
                  {
                    type: 'menuitem',
                    text: 'Success',
                    icon: 'checkmark',
                    onAction: function () {
                      editor.insertContent('<div class="callout-box callout-success"><div class="callout-icon">✅</div><div class="callout-content"><p>Success callout</p></div></div><p>&nbsp;</p>');
                    }
                  },
                  {
                    type: 'menuitem',
                    text: 'Error',
                    icon: 'remove',
                    onAction: function () {
                      editor.insertContent('<div class="callout-box callout-error"><div class="callout-icon">❌</div><div class="callout-content"><p>Error callout</p></div></div><p>&nbsp;</p>');
                    }
                  },
                  {
                    type: 'menuitem',
                    text: 'Note',
                    icon: 'edit-block',
                    onAction: function () {
                      editor.insertContent('<div class="callout-box callout-note"><div class="callout-icon">📝</div><div class="callout-content"><p>Note callout</p></div></div><p>&nbsp;</p>');
                    }
                  }
                ];
                callback(items);
              }
            });
            
            editor.ui.registry.addButton('quote_custom', {
              icon: 'quote',
              tooltip: 'Custom Quote',
              onAction: function () {
                editor.insertContent('<blockquote class="custom-quote"><p>Your quote here</p></blockquote>');
              }
            });

            editor.ui.registry.addButton('toggle_dropdown', {
              icon: 'chevron-down',
              tooltip: 'Toggle (Collapsible Content)',
              onAction: function () {
                editor.insertContent(
                  '<div class="notion-toggle-wrapper">' +
                    '<div class="notion-toggle-header" onclick="this.parentNode.classList.toggle(\'expanded\')">' +
                      '<span class="notion-toggle-arrow">▶</span>' +
                      '<span class="notion-toggle-title">Click to expand</span>' +
                    '</div>' +
                    '<div class="notion-toggle-content">' +
                      '<p>Your content here</p>' +
                    '</div>' +
                  '</div>'
                );
                
                const existingScript = editor.dom.select('script.toggle-script');
                if (existingScript.length === 0) {
                  editor.dom.add(editor.getBody(), 'script', {
                    'class': 'toggle-script',
                    type: 'text/javascript'
                  }, `
                    document.addEventListener('click', function(e) {
                      if (e.target.closest('.notion-toggle-header')) {
                        const wrapper = e.target.closest('.notion-toggle-wrapper');
                        if (wrapper) {
                          wrapper.classList.toggle('expanded');
                        }
                      }
                    });
                  `);
                }
              }
            });
          },
          branding: false,
          plugins: [
            "advlist autolink lists link charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount codesample charmap",
            "fontsize"
          ],
          toolbar:
            "formatselect fontsizeselect | undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | codesample link charmap | toggle_dropdown callout_box quote_custom table | file_manager media | removeformat",
          fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 36pt 48pt 72pt",         
          file_browser_callback: false,
          convert_urls: false,
          content_style: `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
            
            .callout-box {
              display: flex;
              border-radius: 4px;
              padding: 16px;
              margin: 8px 0;
              background-color: rgba(235, 236, 237, 0.3);
            }
            
            .callout-icon {
              flex-shrink: 0;
              margin-right: 12px;
              font-size: 20px;
              line-height: 24px;
            }
            
            .callout-content {
              flex-grow: 1;
              min-width: 0;
            }
            
            .callout-content p {
              margin: 0;
            }
            
            .callout-info {
              background-color: rgba(35, 131, 226, 0.14);
              border-left: 4px solid rgb(35, 131, 226);
            }
            
            .callout-warning {
              background-color: rgba(255, 155, 0, 0.14);
              border-left: 4px solid rgb(255, 155, 0);
            }
            
            .callout-success {
              background-color: rgba(0, 200, 83, 0.14);
              border-left: 4px solid rgb(0, 200, 83);
            }
            
            .callout-error {
              background-color: rgba(255, 88, 88, 0.14);
              border-left: 4px solid rgb(255, 88, 88);
            }
            
            .callout-note {
              background-color: rgba(166, 168, 170, 0.14);
              border-left: 4px solid rgb(166, 168, 170);
            }
            
            .notion-toggle-wrapper {
              margin: 4px 0;
              padding: 3px 2px;
              width: 100%;
            }
            
            .notion-toggle-header {
              cursor: pointer;
              font-weight: 500;
              padding: 4px 0;
              display: flex;
              align-items: center;
              user-select: none;
            }
            
            .notion-toggle-arrow {
              display: inline-block;
              margin-right: 8px;
              transition: transform 0.2s ease;
              color: rgb(55, 53, 47);
              font-size: 12px;
            }
            
            .notion-toggle-wrapper.expanded .notion-toggle-arrow {
              transform: rotate(90deg);
            }
            
            .notion-toggle-title {
              flex-grow: 1;
            }
            
            .notion-toggle-content {
              padding-left: 24px;
              margin-top: 4px;
              display: none;
            }
            
            .notion-toggle-wrapper.expanded .notion-toggle-content {
              display: block;
            }
            
            .notion-toggle-content p {
              margin: 0;
              padding: 4px 0;
            }
          `,
        } as any}
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
      />
      {isOpenFileManagement && (
        <FileManagerModal
          url="news/upload"
          urlGet="news/get-all"
          isOpen={isOpenFileManagement}
          onClose={() => setIsOpenFileManagement(false)}
          onChange={onSelectFile}
          returnUrlOnly={true}
        />
      )}
    </div>
  );
});
BeamEditor.displayName = 'BeamEditor';
