'use client'

import { useState } from 'react'
import './Modal.scss'

export function Modal({ visibility, setVisibility, setTarefas, saveTarefas, setError }) {
     const [novaTarefa, setNovaTarefa] = useState('')

     const adicionarTarefa = () => {
          try {
               const storageTarefas = JSON.parse(localStorage.getItem('tarefas')) || []
               const newTask = { id: Date.now(), nome: novaTarefa, done: false }
               const novasTarefas = [...storageTarefas, newTask]
               saveTarefas(novasTarefas)
               setVisibility(false)
               setNovaTarefa('')
          } catch (err) {
               console.error('Erro:', err)
               setError('Erro ao adicionar tarefa. Por favor, tente novamente.')
          }
     }

     return (
          <div className={`modal ${visibility ? 'visible' : ''}`}>
               <div className='modal__content'>
                    <h2 className='modal__title'>Nova tarefa</h2>
                    Título
                    <input
                         type='text'
                         className='modal__input'
                         placeholder='Digite o nome da tarefa'
                         name='tarefa'
                         required
                         value={novaTarefa}
                         onChange={(event) => setNovaTarefa(event.target.value)}
                    />
                    <div className='modal__buttons'>
                         <button
                              className='modal__button modal__button--cancel'
                              type='button'
                              onClick={() => setVisibility(false)}
                         >
                              Cancelar
                         </button>
                         <button className='modal__button modal__button--add' type='button' onClick={adicionarTarefa}>
                              Adicionar
                         </button>
                    </div>
               </div>
          </div>
     )
}

export function ModalConfirmarDelete({ visibility, setVisibility, deleteTarefa, tarefaId }) {
     const confirmarDelete = () => {
          deleteTarefa(tarefaId)
          setVisibility(false)
     }

     return (
          <div className={`modal ${visibility ? 'visible' : ''}`}>
               <div className='modal__content'>
                    <h2 className='modal__title'>Deletar tarefa</h2>
                    <p>Tem certeza que deseja excluir esta tarefa?</p>
                    <div className='modal__buttons'>
                         <button
                              className='modal__button modal__button--cancel'
                              type='button'
                              onClick={() => setVisibility(false)}
                         >
                              Cancelar
                         </button>
                         <button
                              className='modal__button modal__button--delete'
                              type='button'
                              onClick={confirmarDelete}
                         >
                              Confirmar
                         </button>
                    </div>
               </div>
          </div>
     )
}
