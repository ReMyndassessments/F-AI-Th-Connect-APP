import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function SimpleDropdownTest() {
  const [selectedValue, setSelectedValue] = useState('');
  
  const options = ['Jacob', 'Noah', 'Zechariah', 'Isaac'];
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Simple Dropdown Test</h3>
      
      <Select
        value={selectedValue}
        onValueChange={(value) => {
          console.log('Selected:', value);
          setSelectedValue(value);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose your answer..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-sm text-gray-600">
        Selected: {selectedValue || 'None'}
      </div>
      
      <Button
        onClick={() => {
          console.log('Submit clicked with value:', selectedValue);
          alert(`You selected: ${selectedValue}`);
        }}
        disabled={!selectedValue}
        className="w-full"
      >
        Submit Answer
      </Button>
    </div>
  );
}