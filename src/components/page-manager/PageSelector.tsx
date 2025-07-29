import React from 'react';
import { Page, SelectOption } from '@/types/page';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';

interface PageSelectorProps {
  pages: Page[];
  onPageSelect: (pageId: number) => void;
  disabled?: boolean;
}

const PageSelector: React.FC<PageSelectorProps> = ({ pages, onPageSelect, disabled = false }) => {
  const pagesOptions: SelectOption[] = pages.map((page) => ({
    value: page.id,
    label: page.slug || "",
  }));

  const handleSelectChange = (value: string | number) => {
    onPageSelect(Number(value));
  };

  return (
    <div className={disabled ? "hidden" : ""}>
      <Label>Select Input & Edit</Label>
      <div className="relative">
        <Select
          options={pagesOptions}
          placeholder="Select Option"
          onChange={handleSelectChange}
          className="dark:bg-dark-900"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
};

export default PageSelector;
