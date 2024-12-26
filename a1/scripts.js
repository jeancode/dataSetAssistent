$(document).ready(function () {
    let messages = [];
    let editingId = null;
    let darkMode = false;
  
    function renderMessages() {
      $('#messagesContainer').empty();
      messages.forEach(msg => {
        let messageClass = msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100';
        let contentHtml = editingId === msg.id
          ? `<textarea class="message-content">${msg.content}</textarea>`
          : `<p class="message-content">${msg.content}</p>`;
  
        $('#messagesContainer').append(`
          <div class="p-4 rounded-lg ${messageClass}">
            <div class="flex justify-between items-start">
              <span class="font-bold">${msg.role === 'user' ? 'User' : 'Assistant'}</span>
              <div>
                <button class="btn edit-button" data-id="${msg.id}"><span class="icon edit"></span></button>
                <button class="btn delete-button" data-id="${msg.id}"><span class="icon trash"></span></button>
              </div>
            </div>
            ${contentHtml}
          </div>
        `);
      });
  
      $('#itemCount').text(`Items: ${messages.length}`);
    }
  
    $('#addMessageButton').click(function () {
      const newMessage = $('#newMessageInput').val().trim();
      const selectedRole = $('#roleSelect').val();
  
      if (newMessage) {
        messages.push({ id: Date.now(), role: selectedRole, content: newMessage });
        $('#newMessageInput').val('');
        renderMessages();
      }
    });
  
    $('#messagesContainer').on('click', '.edit-button', function () {
      editingId = $(this).data('id');
      renderMessages();
    });
  
    $('#messagesContainer').on('blur', '.message-content', function () {
      const newContent = $(this).val();
      messages = messages.map(msg => msg.id === editingId ? { ...msg, content: newContent } : msg);
      editingId = null;
      renderMessages();
    });
  
    $('#messagesContainer').on('click', '.delete-button', function () {
      const id = $(this).data('id');
      messages = messages.filter(msg => msg.id !== id);
      renderMessages();
    });
  
    $('#darkModeSwitch').change(function () {
      darkMode = !darkMode;
      $('body').toggleClass('dark-mode', darkMode);
    });
  
    $('#downloadJSON').click(function () {
      const dataToDownload = {
        messages: messages.map(({ role, content }) => ({ role, content }))
      };
      const jsonString = JSON.stringify(dataToDownload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = $('<a></a>').attr('href', url).attr('download', 'training_data.json').appendTo('body');
      a[0].click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  
    renderMessages();
  });
  