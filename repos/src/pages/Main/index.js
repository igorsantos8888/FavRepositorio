/* eslint-disable jsx-a11y/anchor-is-valid */
import { React, useState, useCallback, useEffect } from 'react'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const Main = () => {

  const [newRepo, setNewRepo] = useState('')
  const [repositorios, setRepositorios] = useState([])
  const [loading, setLoading] = useState(false)
  const [alerta, setAlert] = useState(null)


  //* Buscar
  useEffect(() => {
    const repoStorage = localStorage.getItem('@repos')
    if(repoStorage) {
      setRepositorios(JSON.parse(repoStorage))
    }
  }, [])

  //* Salvar Alterações
  useEffect(() => {
    localStorage.setItem('@repos', JSON.stringify(repositorios))

  }, [repositorios])


  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    async function submit() {

      setLoading(true)
      setAlert(null)


      try {

        if (newRepo === '') {
          throw new Error('Você precisa indicar um repositório')
          ///alert('Digite algum repositório')
          /* setLoading(false)
          return */
        }

        const response = await api.get(`repos/${newRepo}`)

        const hasRepo = repositorios.find(repo => repo.name === newRepo)

        if (hasRepo) {
          throw new Error('Repositório duplicado')
          //alert('Repositório duplicado')
          /* setNewRepo('')
          setLoading(false)
          return */
        }

        const data = {
          name: response.data.full_name,
        }
        setRepositorios([...repositorios, data])
        setNewRepo('')
      }
      catch (error) {
        setAlert(true)
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }

    submit()

  }, [newRepo, repositorios])


  function handleInputChange(e) {
    setNewRepo(e.target.value)
    setAlert(null)
  }

  const handleDelete = useCallback((repo) => {
    const find = repositorios.filter(r => r.name !== repo)
    setRepositorios(find)
  }, [repositorios])

  return (
    <div>
      <Container>

        <h1>
          <FaGithub size={25} />
          Meus Repositórios
        </h1>

        <Form onSubmit={handleSubmit} error={alerta}>
          <input
            type='text'
            placeholder='Adicionar Repositórios'
            value={newRepo}
            onChange={handleInputChange}
          />

          <SubmitButton Loading={loading ? 1 : 0}>
            {
              loading ? (
                <FaSpinner color='#fff' size={14} />
              ) : (
                <FaPlus color='#fff' size={14} />
              )
            }
          </SubmitButton>

        </Form>

        <List>
          {
            repositorios.map(repo => (
              <li key={repo.name}>
                <span>
                  <DeleteButton onClick={() => handleDelete(repo.name)}>
                    <FaTrash size={15} />
                  </DeleteButton>
                  {repo.name}
                </span>
                <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                  <FaBars size={25} />
                </Link>
              </li>
            ))
          }
        </List>

      </Container>
    </div>
  )
}

export default Main