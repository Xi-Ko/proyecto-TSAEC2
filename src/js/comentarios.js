document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.getElementById("commentForm");
  const commentsList = document.querySelector(".comments-list");

  // Función para formatear la fecha relativa
  function getRelativeTimeString(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days} día${days > 1 ? "s" : ""}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    return "Hace un momento";
  }

  // Función para crear un nuevo comentario
  function createCommentElement(comment) {
    const commentElement = document.createElement("div");
    commentElement.className = "glass-card comment";
    commentElement.innerHTML = `
            <div class="comment-header">
                <img src="${
                  comment.avatar || "/visual/images/default-avatar.png"
                }" alt="Avatar" class="user-avatar">
                <div class="comment-info">
                    <h3>${comment.username}</h3>
                    <span class="timestamp">${getRelativeTimeString(
                      new Date()
                    )}</span>
                </div>
            </div>
            <div class="comment-content">
                <p>${comment.content}</p>
            </div>
            <div class="comment-actions">
                <button class="vote-btn upvote">
                    <i class="fas fa-arrow-up"></i>
                    <span class="vote-count">0</span>
                </button>
                <button class="reply-btn">
                    <i class="fas fa-reply"></i> Responder
                </button>
            </div>
            <div class="replies"></div>
        `;

    // Agregar evento para el botón de votar
    const voteBtn = commentElement.querySelector(".vote-btn");
    voteBtn.addEventListener("click", () => {
      const voteCount = voteBtn.querySelector(".vote-count");
      const currentVotes = parseInt(voteCount.textContent);
      voteCount.textContent = currentVotes + 1;
      voteBtn.classList.add("voted");
    });

    // Agregar evento para el botón de responder
    const replyBtn = commentElement.querySelector(".reply-btn");
    replyBtn.addEventListener("click", () => {
      const repliesContainer = commentElement.querySelector(".replies");
      const replyForm = document.createElement("div");
      replyForm.className = "glass-card reply-form";
      replyForm.innerHTML = `
                <form>
                    <textarea placeholder="Escribe tu respuesta..." required></textarea>
                    <div class="form-actions">
                        <button type="submit" class="cta-button">
                            <i class="fas fa-paper-plane"></i> Responder
                        </button>
                        <button type="button" class="cancel-btn">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            `;

      // Reemplazar el formulario existente si hay uno
      const existingForm = repliesContainer.querySelector(".reply-form");
      if (existingForm) {
        existingForm.remove();
      } else {
        repliesContainer.insertBefore(replyForm, repliesContainer.firstChild);
      }

      // Manejar el envío de la respuesta
      const form = replyForm.querySelector("form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = form.querySelector("textarea").value;
        if (content.trim()) {
          const reply = {
            username: "Usuario Actual", // Esto debería venir del sistema de autenticación
            content: content,
            avatar: "/visual/images/default-avatar.png",
          };
          addReply(repliesContainer, reply);
          replyForm.remove();
        }
      });

      // Manejar el botón de cancelar
      const cancelBtn = replyForm.querySelector(".cancel-btn");
      cancelBtn.addEventListener("click", () => {
        replyForm.remove();
      });
    });

    return commentElement;
  }

  // Función para agregar una respuesta
  function addReply(container, reply) {
    const replyElement = document.createElement("div");
    replyElement.className = "glass-card reply";
    replyElement.innerHTML = `
            <div class="comment-header">
                <img src="${reply.avatar}" alt="Avatar" class="user-avatar">
                <div class="comment-info">
                    <h3>${reply.username}</h3>
                    <span class="timestamp">${getRelativeTimeString(
                      new Date()
                    )}</span>
                </div>
            </div>
            <div class="comment-content">
                <p>${reply.content}</p>
            </div>
            <div class="comment-actions">
                <button class="vote-btn upvote">
                    <i class="fas fa-arrow-up"></i>
                    <span class="vote-count">0</span>
                </button>
                <button class="reply-btn">
                    <i class="fas fa-reply"></i> Responder
                </button>
            </div>
        `;

    // Agregar eventos similares a los del comentario principal
    const voteBtn = replyElement.querySelector(".vote-btn");
    voteBtn.addEventListener("click", () => {
      const voteCount = voteBtn.querySelector(".vote-count");
      const currentVotes = parseInt(voteCount.textContent);
      voteCount.textContent = currentVotes + 1;
      voteBtn.classList.add("voted");
    });

    container.appendChild(replyElement);
  }

  // Manejar el envío de nuevos comentarios
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = commentForm.querySelector("textarea").value;
    if (content.trim()) {
      const comment = {
        username: "Usuario Actual", // Esto debería venir del sistema de autenticación
        content: content,
        avatar: "/visual/images/default-avatar.png",
      };
      const commentElement = createCommentElement(comment);
      commentsList.insertBefore(commentElement, commentsList.firstChild);
      commentForm.reset();
    }
  });
});
