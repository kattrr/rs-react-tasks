import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import AboutPage from '../AboutPage';

describe('AboutPage', () => {
  const renderAboutPage = () => {
    return render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
  };

  it('renders the about page title', () => {
    renderAboutPage();
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('displays contact links', () => {
    renderAboutPage();

    const emailLink = screen.getByText('Email');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:katheriverar@gmail.com');

    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/kattrr');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/katheringriverar/'
    );
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    const behanceLink = screen.getByText('Behance');
    expect(behanceLink).toBeInTheDocument();
    expect(behanceLink).toHaveAttribute(
      'href',
      'https://www.behance.net/katherivera'
    );
    expect(behanceLink).toHaveAttribute('target', '_blank');
    expect(behanceLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays RS School React course link', () => {
    renderAboutPage();
    const rsSchoolLink = screen.getByText('RS School React Course');
    expect(rsSchoolLink).toBeInTheDocument();
    expect(rsSchoolLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(rsSchoolLink).toHaveAttribute('target', '_blank');
    expect(rsSchoolLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
