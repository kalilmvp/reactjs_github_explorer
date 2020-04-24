import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';

import logo from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const localStorageName = '@GitHubExplorer:repositories';
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const repositoriesStored = localStorage.getItem(localStorageName);

    if (repositoriesStored) {
      return JSON.parse(repositoriesStored);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(localStorageName, JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    // adicionar novo repositorio
    // consumir api do github
    // adicionar

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      setRepositories([...repositories, response.data]);

      setNewRepo('');
      setInputError('');
    } catch (err) {
      console.error(err);

      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore Repositórios no Github</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img src={repository.owner.avatar_url} alt={repository.full_name} />
            <div>
              <strong>{repository.owner.login}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
