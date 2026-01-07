import React from 'react'

export const Footer = () => {
  return (
    <>
        <footer class="bg-dark text-light pt-5 pb-4">
        <div class="container">
            <div class="row">
                {/* <!-- Sobre a Loja --> */}
                <div class="col-md-3">
                    <h5>🌱 Sobre a Loja</h5>
                    <p class="small">A melhor loja de jardinagem, trazendo plantas, sementes e acessórios para você transformar seu espaço.</p>
                </div>
    
                {/* <!-- Atendimento --> */}
                <div class="col-md-3">
                    <h5>📞 Atendimento</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-light text-decoration-none">Fale Conosco</a></li>
                        <li><a href="#" class="text-light text-decoration-none">Política de Privacidade</a></li>
                        <li><a href="#" class="text-light text-decoration-none">Trocas e Devoluções</a></li>
                    </ul>
                </div>
    
                {/* <!-- Redes Sociais --> */}
                <div class="col-md-3">
                    <h5>📢 Redes Sociais</h5>
                    <a href="#" class="text-light me-2"><i class="fab fa-facebook fa-lg"></i></a>
                    <a href="#" class="text-light me-2"><i class="fab fa-instagram fa-lg"></i></a>
                    <a href="#" class="text-light"><i class="fab fa-whatsapp fa-lg"></i></a>
                </div>
    
                {/* <!-- Formas de Pagamento --> */}
                <div class="col-md-3">
                    <h5>💳 Pagamento</h5>
                    <img src="https://images.tcdn.com.br/exclusive/assets/store/img/icons/formas_pagamento/pag_peqcartaovisa.png?7e0d94a2e3076197c5e2a453b1e80183" width="30" alt="Visa"/>
                    <img src="https://images.tcdn.com.br/exclusive/assets/store/img/icons/formas_pagamento/pag_peqcartaomastercard.png?7e0d94a2e3076197c5e2a453b1e80183" width="30" alt="Mastercard"/>
                    <img src="https://images.tcdn.com.br/exclusive/assets/store/img/icons/formas_pagamento/pag_pd_peqcartaohiper.png?7e0d94a2e3076197c5e2a453b1e80183" width="30" height="25" alt="Hiper"/>
                    <img src="https://images.tcdn.com.br/exclusive/assets/store/img/icons/formas_pagamento/pag_peqcartaoelo.png?7e0d94a2e3076197c5e2a453b1e80183" width="30" alt="Elo" />
                    
                </div>
            </div>
    
            <hr class="bg-light" />
    
            {/* <!-- Direitos Autorais --> */}
            <div class="text-center">
                <p class="small mb-0">&copy; 2025 Plantei. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
    </>
  )
}
