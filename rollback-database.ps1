$name=$args[0]

if ($args.Count -eq 0) {
  $name= Read-Host -Prompt "Enter the name of last applied migration"
}

dotnet ef database update -s ".\src\ShoppingList.Api\" -p ".\src\ShoppingList.Api\" $name